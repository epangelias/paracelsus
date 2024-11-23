import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';
import { asset, IS_BROWSER } from 'fresh/runtime';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export async function requestPushSubscription(worker?: ServiceWorkerRegistration | null) {
  if (!worker) return null;

  if (Notification.permission == 'denied') {
    alert('Notifications are disabled. Please enable them in your browser or device settings.');
    return null;
  }

  const existingSubscription = await worker.pushManager.getSubscription();
  if (existingSubscription) return existingSubscription;

  const vapidPublicKey = await fetchOrError('/api/vapid-public-key') as string;
  console.log('Loaded VAPID key: ', vapidPublicKey);
  const convertedVapidKey = Meth.urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await worker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  console.log('Subscribed.');

  await fetchOrError('/api/subscribe-notifications', { method: 'POST', body: { subscription } });

  return subscription;
}

export async function getSubscription(worker?: ServiceWorkerRegistration) {
  if (!worker) return null;
  if (Notification.permission !== 'granted') return null;
  return await worker.pushManager.getSubscription();
}

export async function loadServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if ('serviceWorker' in navigator == false) {
    return console.warn('Service Worker Disabled') as undefined;
  }
  console.log('Loading registration...');

  let registration = await navigator.serviceWorker.getRegistration();

  if (!registration) {
    console.log('Creating registration...');
    registration = await navigator.serviceWorker.register(asset('/worker.js'), { scope: '/' });
  }

  console.log('Loaded registration: ', registration);

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
  const requestSubscription = () => pushSubscription.value = requestPushSubscription(worker.value);

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

  return { isPWA, installPWA, worker, pushSubscription, requestSubscription };
}
