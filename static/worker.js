self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => cache.addAll(['/', '/offline'])),
  );
});

self.addEventListener('fetch', (event) => {
  const acceptsHTML = event.request.headers.get('Accept')?.includes('text/html');
  if (!acceptsHTML) return;

  event.respondWith(
    fetch(event.request)
      .catch(async (_e) => {
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

async function setHomepageCache() {
  console.log('setting cache');
  const cache = await caches.open('offline-cache');
  return fetch('/').then((res) => cache.put('/', res));
}

self.addEventListener('message', (event) => {
  const data = event.data;

  if (data.type === 'cache') event.waitUntil(setHomepageCache());
  else if (data.type === 'ping') console.log('pong');
});
