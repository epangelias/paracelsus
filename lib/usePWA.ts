import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';
import { asset, IS_BROWSER } from 'fresh/runtime';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export async function requestPushSubscription(worker?: ServiceWorkerRegistration | null) {
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

  console.log(subscription);

  console.log('Subscribed.');

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

  const workerURL = asset('/worker.js');
  const oldWorkerURL = registration?.active?.scriptURL;

  if (!registration || oldWorkerURL != workerURL) {
    if (registration) await registration.unregister();
    registration = await navigator.serviceWorker.register(workerURL, { scope: '/' });
  }

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
      e.preventDefault();

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
      return pushSubscription.value = await requestPushSubscription(worker.value);
    },
  };
}
