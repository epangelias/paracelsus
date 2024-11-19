self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('offline-cache').then((cache) => {
            return cache.addAll(['/offline']);
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match('/offline');
        }),
    );
});

self.addEventListener('push', function (event) {
    const data = event.data.json(); // Parse the incoming push message
    const options = {
        body: data.body,
        icon: data.icon,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options),
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/'),
    );
});
