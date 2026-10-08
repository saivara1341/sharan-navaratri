const CACHE_NAME = 'sharan-navaratri-pwa-v1';
const APP_SHELL = [
  '/navaratri',
  '/navaratri/manifest.json',
  '/navaratri/assets/app-icon-192.png',
  '/navaratri/assets/app-icon-512.png',
  '/navaratri/assets/trishula-head.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => undefined))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' && url.pathname.startsWith('/navaratri')) {
    event.respondWith(fetch(request).catch(() => caches.match('/navaratri')));
    return;
  }

  if (url.pathname.startsWith('/navaratri/assets/') || url.pathname === '/navaratri/manifest.json') {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }))
    );
  }
});
