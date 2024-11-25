/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Security issues:
Cache injection vulnerability, consider validating the cache keys.

Performance issues:
None found.

Code style issues:
Consistent spacing and indentation would improve readability.

Best practices:
Consider adding error handling for cache operations and network requests.

Maintainability issues:
None found.

Readability issues:
Variable names could be more descriptive, especially in the 'push' event handler.

Refactoring suggestions:
Consider extracting the cache management logic into separate functions for better modularity.

Note: The 'self.origin' in the 'notificationclick' event handler assumes the service worker is hosted on the same origin as the main app, which might not always be the case.
*/


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
  const data = event.data.json();
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
