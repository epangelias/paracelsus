self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.addAll(['/', '/offline'])),
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
        else if (new URL(event.request.url).pathname === '/') return caches.match('/');
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

  if (data.type === 'cache') {
    event.waitUntil(
      caches.open('offline-cache').then((cache) => cache.delete('/').then(() => cache.add('/'))),
    );
  } else if (data.type === 'ping') {
    console.log('pong');
  }
});
