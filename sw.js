/* IGERS POWERCORE service worker.
 * Keep this file intentionally network-light: no stale application cache is kept.
 * Bump REVISION whenever shipping an application update.
 */
const REVISION = 'igers-2026-10-13-railway-concept-v2';
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      client.postMessage({ type: 'IGERS_SERVICE_WORKER_ACTIVE', revision: REVISION });
    }
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'IGERS_SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url
    ? new URL(event.notification.data.url, self.registration.scope).href
    : new URL('./#emergencyCenter', self.registration.scope).href;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      if (!('focus' in client)) continue;
      if (event.notification.data && event.notification.data.url && 'navigate' in client) {
        try { await client.navigate(target); } catch (_) {}
      }
      return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
