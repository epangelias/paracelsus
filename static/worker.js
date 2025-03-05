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
  const acceptsHTML = event.request.headers.get('Accept')?.includes('text/html');

  event.respondWith(
    fetch(event.request)
      .catch(async (e) => {
        if (!acceptsHTML) throw e;
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

self.addEventListener('message', async (event) => {
  const data = event.data;

  if (data.type === 'CATCH') {
    const response = fetch('/').catch((e) => e);

    if (response.ok) {
      const cache = await caches.open('offline-cache');
      await cache.put('/', response);
    } else console.error('Failed to update homepage catch');
  }
});
