self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.addAll(['/', '/offline'])),
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.delete('/').then(() => cache.add('/'))),
  );
});

self.addEventListener('fetch', (event) => {
  const isAPI = new URL(event.request.url).pathname.startsWith('/api');

  event.respondWith(
    fetch(event.request)
      .catch(async (e) => {
        if (isAPI) throw e;
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        else return caches.match('/offline');
      }),
  );
});

self.addEventListener('push', (event) => {
  const data = !text.startsWith('{') ? { title: event.data.text() } : event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, data));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(self.origin));
});
