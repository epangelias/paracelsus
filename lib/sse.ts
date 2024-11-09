import { Signal } from '@preact/signals';
import { fetchOrError } from '@/lib/fetch.ts';
import { Meth } from '@/lib/meth.ts';

export function syncSSE<T>(endpoint: string, data: Signal<T>) {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (e) => {
        const newData = JSON.parse(e.data);
        if (Meth.objectEquals(data.value, newData)) return;
        data.value = newData;
    }
    eventSource.onerror = (error) => console.log('SSE error: ', error);

    return () => eventSource?.close();
}


export async function sendSSE<T>(endpoint: string, body: unknown) {
    return await fetchOrError<T>(endpoint, { method: 'POST', body });
}

export function watchSSE<T>(endpoint: string, handler: (data: T) => void) {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (e) => handler(JSON.parse(e.data));
    eventSource.onerror = (error) => console.log('SSE error: ', error);

    return () => eventSource?.close();
}