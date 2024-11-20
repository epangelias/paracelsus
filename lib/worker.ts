import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';
import { asset } from 'fresh/runtime';


export async function requestSubscription(registration?: ServiceWorkerRegistration | null) {
    if(!registration)return null;

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) return existingSubscription;

    const response = await fetch('/api/vapidPublicKey');
    const vapidPublicKey = await response.text();
    const convertedVapidKey = Meth.urlBase64ToUint8Array(vapidPublicKey);

    const subscription = registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
    });

    await fetchOrError('/api/register', { method: 'POST', body: { subscription } });

    return subscription;
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

// const registration = await initServiceWorker();

//     if(registration){
        
//         globalThis.testPush = async () => {
//             const subscription = await requestNotificationRegistration(registration);
//             subscription.
            
//             await fetchOrError('/api/sendNotification', { method: 'POST', body: { subscription } });
//         };
//     }