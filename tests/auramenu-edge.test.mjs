import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import worker from '../edge/worker.mjs';

const shell = await readFile(new URL('../menu.html', import.meta.url), 'utf8');
const menu = {
  slug: 'moka', businessName: 'Moka </script>& Café', description: 'Brunch & coffee',
  menuLanguage: 'en', restaurant: { logo: '/assets/moka.webp' },
};
function fixture(status = 200, body = { menu }) {
  const requests = [];
  return {
    requests,
    env: {
      CANONICAL_ORIGIN: 'https://auramenu.space',
      ASSETS: { fetch: async request => {
        const path = new URL(request.url).pathname;
        if (path === '/menu.html') return new Response(shell);
        if (['/', '/gallery.html', '/menu-v2/engine.js'].includes(path)) return new Response('static');
        return new Response('origin 404', { status: 404 });
      } },
      AURADIGITAL: { fetch: async request => {
        requests.push(request);
        return Response.json(body, { status });
      } },
    },
  };
}

test('legacy and clean menu URLs on both hosts have safe canonical metadata', async () => {
  for (const host of ['auramenu.space', 'www.auramenu.space']) {
    for (const path of ['/moka', '/moka/?table=4&lang=fr', '/menu.html?slug=moka&table=4', '/404.html?slug=Moka']) {
      const { requests, env } = fixture();
      const request = new Request(`https://${host}${path}`);
      const response = await worker.fetch(request, env);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('location'), null);
      assert.equal(new URL(request.url).search, new URL(`https://${host}${path}`).search);
      assert.equal(new URL(requests[0].url).pathname, '/api/auramenu/sites/moka');
      assert.equal(requests[0].headers.get('Cookie'), null);
      const html = await response.text();
      assert.match(html, /<link rel="canonical" href="https:\/\/auramenu\.space\/moka">/);
      assert.match(html, /og:image.*https:\/\/auramenu\.space\/assets\/moka\.webp/);
      assert.match(html, /Moka &lt;\/script&gt;&amp; Café/);
      assert.match(html, /"@type":"Restaurant"/);
      assert.match(html, /id="menuRoot"/);
      const head = await worker.fetch(new Request(request.url, { method: 'HEAD' }), env);
      assert.equal(head.status, 200);
      assert.equal(await head.text(), '');
    }
  }
});

test('unknown menus are 404 and upstream errors are retryable', async () => {
  for (const [status, body, expected] of [[404, {}, 404], [500, {}, 503], [200, {}, 503], [302, {}, 503]]) {
    const { env } = fixture(status, body);
    const response = await worker.fetch(new Request('https://auramenu.space/moka'), env);
    assert.equal(response.status, expected);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  const { env } = fixture();
  env.AURADIGITAL.fetch = async () => { throw new Error('fixture unavailable'); };
  const response = await worker.fetch(new Request('https://auramenu.space/moka'), env);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Retry-After'), '30');
});

test('API requests keep method, query and session, and static paths keep their origin responses', async () => {
  const { requests, env } = fixture();
  for (const path of ['/', '/gallery.html', '/menu-v2/engine.js']) {
    assert.equal(await (await worker.fetch(new Request('https://auramenu.space' + path), env)).text(), 'static');
  }
  for (const [path, query] of [['/login', ''], ['/login/', '?lang=ar'], ['/login.html', '?next=studio.html']]) {
    const r = await worker.fetch(new Request('https://auramenu.space' + path + query), env);
    assert.equal(r.status, 301); assert.equal(r.headers.get('Location'), '/signin.html' + query);
  }
  assert.equal((await worker.fetch(new Request('https://auramenu.space/login', { method: 'POST', body: '{}' }), env)).status, 404, 'non-GET legacy login is not redirected');
  for (const path of ['/account', '/.well-known/missing', '/assets/missing.png']) {
    assert.equal((await worker.fetch(new Request('https://auramenu.space' + path), env)).status, 404);
  }
  const request = new Request('https://auramenu.space/api/auramenu/requests?test=1', {
    method: 'POST', body: '{}', headers: { Cookie: 'stage=fixture' },
  });
  await worker.fetch(request, env);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, request.url);
  assert.equal(requests[0].method, 'POST');
  assert.equal(requests[0].headers.get('cookie'), 'stage=fixture');
  assert.equal(await requests[0].text(), '{}');
});

test('rolling back the edge renderer leaves API and static paths operational', async () => {
  const { env } = fixture();
  const url = 'https://auramenu.space/moka';
  assert.equal((await worker.fetch(new Request(url), env)).status, 200);
  env.PRETTY_MENU_ROUTES = 'false';
  assert.equal((await worker.fetch(new Request(url), env)).status, 404);
  assert.equal((await worker.fetch(new Request('https://auramenu.space/api/auramenu/sites/moka'), env)).status, 200);
  assert.equal((await worker.fetch(new Request('https://auramenu.space/menu.html?slug=moka'), env)).status, 200);
  env.PRETTY_MENU_ROUTES = 'true';
  assert.equal((await worker.fetch(new Request(url), env)).status, 200);
});
