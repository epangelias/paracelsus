import { Meth } from '@/lib/utils/meth.ts';
import { fetchOrError } from '@/lib/utils/fetch.ts';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export async function requestPushSubscription(worker?: ServiceWorkerRegistration | null) {
  console.log('Requesting subscription...');

  if (!worker) return null;

  if (Notification.permission == 'denied') return null;

  const existingSubscription = await worker.pushManager.getSubscription();
  if (existingSubscription) return existingSubscription;

  const vapidPublicKey = await fetchOrError('/api/vapid-public-key') as string;
  console.log('Loaded VAPID key: ', vapidPublicKey);
  const convertedVapidKey = Meth.urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await worker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  console.log('Subscribed.', subscription);

  await fetchOrError('/api/subscribe-notifications', { method: 'POST', body: { subscription } });

  return subscription;
}

export async function getSubscription(worker: ServiceWorkerRegistration | null) {
  if (!worker) return null;
  // if (Notification.permission !== 'granted') null;
  return await worker.pushManager.getSubscription();
}

export async function loadServiceWorker() {
  if ('serviceWorker' in navigator == false) {
    console.warn('Service Worker Disabled');
    return null;
  }

  let registration = await navigator.serviceWorker.getRegistration();

  registration?.update();

  if (!registration) registration = await navigator.serviceWorker.register('/worker.js', { scope: '/' });

  navigator.serviceWorker.controller?.postMessage({ type: 'ping' });
  navigator.serviceWorker.controller?.postMessage({ type: 'cache' });

  return registration;
}

export function isIOSSafari(): boolean {
  const userAgent = globalThis.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  return isIOS && isSafari;
}

function detectIsPWA(): boolean {
  return IS_BROWSER && globalThis.matchMedia('(display-mode: standalone)').matches;
}

export function usePWA() {
  const installPWA = useSignal<() => void>();
  const isPWA = useSignal(false);
  const worker = useSignal<ServiceWorkerRegistration | null>(null);
  const pushSubscription = useSignal<PushSubscription | null>(null);

  useEffect(() => {
    globalThis.addEventListener('beforeinstallprompt', (e) => {
      // e.preventDefault();

      const deferredPrompt = e as Event & { prompt: () => void; userChoice: Promise<void> };

      installPWA.value = async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log(choice);
      };
    });

    globalThis.matchMedia('(display-mode: standalone)')
      .addEventListener('change', () => isPWA.value = detectIsPWA());

    isPWA.value = detectIsPWA();

    (async () => {
      worker.value = await loadServiceWorker();
      pushSubscription.value = await getSubscription(worker.value);
    })();
  }, []);

  return {
    isPWA,
    installPWA,
    worker,
    pushSubscription,

    async requestSubscription() {
      // Disallow recreating push subscription, causes old to expire
      if (pushSubscription.value) return pushSubscription.value;
      return pushSubscription.value = await requestPushSubscription(worker.value);
    },
  };
}
