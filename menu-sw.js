/* AuraMenu offline support for public restaurant menus.
   Network first, always: guests see the restaurant's latest prices and stock whenever there is signal.
   When the network fails (or a menu request takes too long), the last copy this phone saw is used,
   so a weak café connection still shows the menu. Registered only from public menu pages. */
const CACHE = "auramenu-offline-v1";
const API_WAIT_MS = 4000;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith("auramenu-offline-") && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

const isMenuApi = (url) => url.pathname.startsWith("/api/auramenu/sites/");
// Only what a public menu needs: the restaurant page itself (auramenu.space/<slug>), the design engine and its files.
const MENU_FILES = /^\/(menu\.html|menu-v2\.html|menu\.css|menu\.js|template-frame\.css|config\.js|am2\/mark\.svg|menu-v2\/.+|fonts\/v2\/.+|media\/template-photos\/.+)$/;
const isSlugPage = (url) => /^\/[a-z0-9-]{2,80}\/?$/i.test(url.pathname) && !/\.[a-z0-9]+$/i.test(url.pathname);
const isMenuFile = (url, request) => isMenuApi(url) || MENU_FILES.test(url.pathname) || (request.mode === "navigate" && isSlugPage(url));
// Cache key without the cache-busting "_" parameter menu.js adds to API calls.
const keyFor = (request, url) => {
  if (!isMenuApi(url)) return request;
  const clean = new URL(url); clean.searchParams.delete("_");
  return new Request(clean.href);
};

async function networkFirst(request, url) {
  const cache = await caches.open(CACHE);
  const key = keyFor(request, url);
  const network = fetch(request).then((response) => {
    if (response && (response.ok || response.status === 404 && request.mode === "navigate") && response.type === "basic") cache.put(key, response.clone());
    return response;
  });
  const timeout = isMenuApi(url) ? new Promise((resolve) => setTimeout(resolve, API_WAIT_MS, null)) : null;
  try {
    const first = timeout ? await Promise.race([network, timeout]) : await network;
    if (first) return first;
    const cached = await cache.match(key);
    return cached || network;
  } catch {
    const cached = await cache.match(key);
    if (cached) return cached;
    throw new Error("offline");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!isMenuFile(url, request)) return; // builder, Studio, account and admin are never touched
  event.respondWith(networkFirst(request, url));
});
