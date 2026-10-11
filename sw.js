/* IGERS POWERCORE service worker.
 * Versioned offline shell cache for local application assets only.
 * Third-party live feeds/APIs are not cached or guaranteed offline.
 */
const REVISION = 'igers-2026-10-11-nextgen-engineering-v3';
const CACHE_NAME = `igers-powercore-shell-${REVISION}`;
const APP_SHELL = [
  './', './index.html',
  './manifest.webmanifest?v=20261009-audit03',
  './igers-compact-bundle.css',
  './design-standard.css?v=20261010-lang-v2',
  './airport-runway-sim.css?v=20261009-audit03',
  './powercore-command-center.css?v=20261011-nextgen-v1',
  './thesis-concept-lab.css?v=20261010-feas-v3',
  './company-operations-suite.css?v=20261010-company-v2',
  './igers-language-addon.css?v=20261011-ja-ur-vi',
  './thesis-concept-integrated.svg',
  './feas-footstep-overview.webp', './feas-footstep-installation.webp',
  './toll-national-pro.js?v=20261009-fix02',
  './nasa-gibs-bd.js?v=20261009-fix02',
  './airport-runway-sim.js?v=20261009-audit03',
  './section-navigation.js?v=20261009-audit03',
  './system-master-control.js?v=20261009-audit03',
  './powercore-command-center.js?v=20261011-fieldcal-v2',
  './thesis-concept-lab.js?v=20261011-feas-units-v4',
  './company-operations-suite.js?v=20261010-company-v2',
  './i18n.js?v=20261011-lang-v2',
  './igers-language-addon.js?v=20261011-nextgen-locale-v2',
  './calculation-integrity-notice.js?v=20261011-audit',
  './data/bangladesh-boundary-fallback.geojson',
  './icon-192.png', './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // A single unavailable optional asset must not prevent worker installation.
    await Promise.allSettled(APP_SHELL.map(path => cache.add(new URL(path, self.registration.scope).href)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('igers-powercore-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) client.postMessage({ type: 'IGERS_SERVICE_WORKER_ACTIVE', revision: REVISION });
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (url.origin !== scopeUrl.origin || !url.href.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const shellUrl = new URL('index.html', self.registration.scope).href;
          await cache.put(shellUrl, response.clone());
        }
        return response;
      } catch (_) {
        return (await cache.match(new URL('index.html', self.registration.scope).href)) ||
          (await cache.match(new URL('./', self.registration.scope).href)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        try { await cache.put(request, response.clone()); } catch (_) { /* Quota/private-mode protection */ }
      }
      return response;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'IGERS_SKIP_WAITING') event.waitUntil(self.skipWaiting());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    for (const client of clients) if ('focus' in client) return client.focus();
    if (self.clients.openWindow) return self.clients.openWindow('./#emergencyCenter');
  }));
});
