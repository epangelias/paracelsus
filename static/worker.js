self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.addAll(['/offline'])),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/offline')),
  );
});

self.addEventListener('push', function (event) {
  event.waitUntil(self.registration.showNotification(data.title, event.data.json()));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(self.origin));
});
