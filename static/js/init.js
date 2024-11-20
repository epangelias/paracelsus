// Service Worker

if ('serviceWorker' in navigator) {
  console.log('Service Worker Enabled');

  globalThis.addEventListener('load', () => {
    console.log('Loading Service Worker...');
    navigator.serviceWorker.register('/js/worker.js').then(async (registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);

      globalThis.testPush = async () => {
        // Subscription for Push Notifications
        try {
          const subscription = await registration.pushManager.getSubscription() ||
            await registerForPushNotifications(registration);
          console.log('Push subscription obtained: ', subscription);

          // Send the subscription to the server
          await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscription }),
          });

          // Simulate sending a notification (replace hardcoded delay/ttl as needed)
          const delay = 5; // Delay in seconds
          const ttl = 60; // Time-to-live in seconds

          console.log('Sending test notification...');
          await fetch('/api/sendNotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscription, delay, ttl }),
          });
          console.log('Notification sent!');
        } catch (error) {
          console.error('Error during Push Subscription process:', error);
        }
      };
    }).catch((error) => {
      console.error('ServiceWorker registration failed: ', error);
    });
  });
} else {
  console.warn('Service Worker Disabled');
}

// Function to handle Push Notification Subscription
async function registerForPushNotifications(registration) {
  // Test unsubscribe
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    await existingSubscription.unsubscribe();
    console.log('Unsubscribed from existing push subscription.');
  }

  console.log('Registering for push notifications...');
  const response = await fetch('/api/vapidPublicKey');
  const vapidPublicKey = await response.text();

  console.log('Obtained VAPID public key: ', vapidPublicKey);

  // Convert VAPID key
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  console.log('Converted VAPID public key: ', convertedVapidKey);

  // Subscribe the user
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
}

// Utility function to convert Base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = globalThis.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Color Scheme Management
let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

if (!colorSchemeMeta) {
  colorSchemeMeta = document.createElement('meta');
  colorSchemeMeta.setAttribute('name', 'color-scheme');
  document.head.appendChild(colorSchemeMeta);
}

const updateTheme = () => {
  const colorScheme = colorSchemeMeta.getAttribute('content');
  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  const canDark = colorScheme.includes('dark');
  const canLight = colorScheme.includes('light') || !canDark;
  const theme = canDark && (prefersDark || !canLight) ? 'dark' : 'light';

  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
};

updateTheme();

globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

new MutationObserver(() => updateTheme())
  .observe(colorSchemeMeta, { attributes: true, attributeFilter: ['content'] });

// iOS active state
document.addEventListener('touchstart', () => {}, { passive: true });

globalThis.addEventListener('beforeunload', () => {
  document.body.classList.add('fade-out');
});
