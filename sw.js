/* IGERS POWERCORE service worker.
 * Keep this file intentionally network-light: no stale application cache is kept.
 * Bump REVISION whenever shipping an application update.
 */
const REVISION = 'igers-2026-10-10-feas-photo-demo-v3';
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
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    for (const client of clients) {
      if ('focus' in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow('./#emergencyCenter');
  }));
});
