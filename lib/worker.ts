import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';
import { asset } from 'fresh/runtime';


export async function requestSubscription(registration?: ServiceWorkerRegistration | null) {
    if (!registration) return null;

    if (Notification.permission == "denied") {
        alert("Notifications are disabled. Please enable them in your browser or device settings.");
        return null;
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) return existingSubscription;


    const vapidPublicKey = await fetchOrError('/api/vapid-public-key') as string;
    console.log("Loaded VAPID key: ", vapidPublicKey);
    const convertedVapidKey = Meth.urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
    });

    console.log("Subscribed.");

    await fetchOrError('/api/subscribe-notifications', { method: 'POST', body: { subscription } });

    return subscription;
}

export async function getSubscription(worker?: ServiceWorkerRegistration) {
    if (!worker) return null;
    if (Notification.permission !== "granted") return null;
    return await worker.pushManager.getSubscription();
}

export async function loadServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
    if ('serviceWorker' in navigator == false) return console.warn('Service Worker Disabled') as undefined;
    console.log("Loading registration...");

    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
        console.log("Creating registration...");
        registration = await navigator.serviceWorker.register(asset('/worker.js'), { scope: '/' });
    }

    console.log("Loaded registration: ", registration);

    return registration;
}