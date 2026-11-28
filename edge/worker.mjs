const slugPattern = /^[a-z0-9-]{1,80}$/;
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const jsonLd = data => JSON.stringify(data).replace(/</g, '\\u003c');

function imageUrl(value, origin) {
  if (typeof value !== 'string' || !value) return;
  try {
    const url = new URL(value, origin);
    if (url.protocol === 'https:' && !url.username && !url.password && !/\.(mp4|webm|m4v)$/i.test(url.pathname)) return url.href;
  } catch {}
}

function menuMetadata(menu, canonical) {
  const name = menu.businessName.trim();
  const title = `${name} — AuraMenu`;
  const description = (menu.description || menu.tagline || `Browse the digital menu for ${name}.`).trim().slice(0, 300);
  const image = imageUrl(menu.restaurant?.cover, canonical) || imageUrl(menu.design?.cover, canonical) ||
    imageUrl(menu.restaurant?.logo, canonical) || imageUrl(menu.categories?.[0]?.items?.[0]?.imageUrl, canonical);
  const schema = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name, url: canonical,
    hasMenu: canonical, description, ...(image ? { image } : {}),
    ...(menu.address ? { address: menu.address } : {}),
    ...(menu.businessPhone ? { telephone: menu.businessPhone } : {}),
  };
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}">`,
    `<link rel="canonical" href="${escape(canonical)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:url" content="${escape(canonical)}">`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    ...(image ? [`<meta property="og:image" content="${escape(image)}">`] : []),
    `<script type="application/ld+json">${jsonLd(schema)}</script>`,
  ].join('\n');
}

function response(request, body, status, noindex) {
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  if (noindex || status !== 200) headers.set('X-Robots-Tag', 'noindex');
  if (status === 503) headers.set('Retry-After', '30');
  return new Response(request.method === 'HEAD' ? null : body, { status, headers });
}

function failure(request, status, title) {
  return response(request, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title></head><body><main><h1>${title}</h1><a href="/">AuraMenu</a></main></body></html>`, status, true);
}

function staticResponse(asset, env) {
  if (env.STAGING !== 'true' || !asset.headers.get('Content-Type')?.includes('text/html')) return asset;
  const headers = new Headers(asset.headers);
  headers.set('X-Robots-Tag', 'noindex');
  return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/edge-runtime.js') {
      return new Response(`window.AURAMENU_ACCOUNTS_ORIGIN = ${JSON.stringify(env.ACCOUNTS_ORIGIN)};\n`, {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
      });
    }
    // Legacy AuraMenu sign-in addresses go to AuraMenu's own authentication page (query such as lang/next kept).
    if (['/login', '/login/', '/login.html'].includes(url.pathname) && ['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, { status: 301, headers: { Location: `/signin.html${url.search}`, 'Cache-Control': 'public, max-age=3600' } });
    }
    if (url.pathname.startsWith('/api/auramenu/')) {
      try {
        return await env.AURADIGITAL.fetch(new Request(request, { redirect: 'manual' }));
      } catch {
        return Response.json({ error: 'Menu service is temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' } });
      }
    }
    if (env.PRETTY_MENU_ROUTES === 'false') {
      return staticResponse(await env.ASSETS.fetch(request), env);
    }

    const legacy = ['/menu.html', '/404.html'].includes(url.pathname);
    const pathSlug = /^\/([a-z0-9-]{1,80})\/?$/i.exec(url.pathname)?.[1]?.toLowerCase();
    const legacySlug = url.searchParams.get('slug');
    const slug = legacySlug ? legacySlug.toLowerCase().replace(/[^a-z0-9-]/g, '') : pathSlug;
    const documentRequest = ['GET', 'HEAD'].includes(request.method);

    if (!documentRequest || !legacy) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404 || !documentRequest || !pathSlug || pathSlug === 'login' || pathSlug === 'account') return staticResponse(asset, env);
    }
    if (!slug || !slugPattern.test(slug)) return failure(request, 404, 'Menu not found');

    try {
      const result = await env.AURADIGITAL.fetch(new Request(new URL(`/api/auramenu/sites/${slug}`, url), {
        headers: { Accept: 'application/json' }, redirect: 'manual',
        signal: AbortSignal.timeout(4000),
      }));
      if (result.status === 404) return failure(request, 404, 'Menu not found');
      if (!result.ok) return failure(request, 503, 'Menu temporarily unavailable');
      const { menu } = await result.json();
      if (typeof menu?.businessName !== 'string' || !menu.businessName.trim() || menu.slug?.toLowerCase() !== slug) {
        return failure(request, 503, 'Menu temporarily unavailable');
      }
      const shell = await env.ASSETS.fetch(new Request(new URL('/menu.html', url)));
      if (!shell.ok) return failure(request, 503, 'Menu temporarily unavailable');
      const canonical = new URL(`/${slug}`, env.CANONICAL_ORIGIN).href;
      const language = ['tr', 'en', 'ar', 'fr'].includes(menu.menuLanguage) ? menu.menuLanguage : 'tr';
      const html = (await shell.text())
        .replace(/<html[^>]*>/i, `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)
        .replace('<title>AuraMenu</title>', () => menuMetadata(menu, canonical));
      return response(request, html, 200, env.STAGING === 'true');
    } catch {
      return failure(request, 503, 'Menu temporarily unavailable');
    }
  },
};
