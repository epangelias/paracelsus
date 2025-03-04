self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.addAll(['/', '/offline'])),
  );
});

self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);
  const isAPI = url.pathname.startsWith('/api');
  const isHomepage = url.pathname === '/';

  const response = fetch(event.request).catch((e) => isAPI ? e : caches.match(isHomepage ? '/' : '/offline'));

  if (isHomepage && response.ok) {
    const cache = await caches.open('offline-cache');
    await cache.put('/', response.clone());
  }

  event.respondWith(response);
});

self.addEventListener('push', function (event) {
  const text = event.data.text();
  const data = !text.startsWith('{') ? { title: text } : event.data.json();
  console.log('Received push', data);
  event.waitUntil(
    self.registration.showNotification(data.title, data),
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(self.origin),
  );
});
