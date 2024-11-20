import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';


export async function requestRegistration(registration?: ServiceWorkerRegistration | null) {
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

async function getRegistration() {
    let registration = await navigator.serviceWorker.ready;

    if (!registration) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        for (const registration of registrations) await registration.unregister();

        registration = await navigator.serviceWorker.register(asset('/worker.js'), { scope: '/' });
    }

    return registration;
}

export async function loadServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
    if ('serviceWorker' in navigator == false) return console.warn('Service Worker Disabled') as undefined;
    await new Promise(resolve => globalThis.addEventListener('load', resolve));
    return await getRegistration();
}

// const registration = await initServiceWorker();

//     if(registration){
        
//         globalThis.testPush = async () => {
//             const subscription = await requestNotificationRegistration(registration);
//             subscription.
            
//             await fetchOrError('/api/sendNotification', { method: 'POST', body: { subscription } });
//         };
//     }