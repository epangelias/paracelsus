import { Signal } from '@preact/signals';
import { fetchOrError } from '@/lib/fetch.ts';
import { Meth } from '@/lib/meth.ts';

export function syncSSE<T>(endpoint: string, data: Signal<T>) {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        if (Meth.objectEquals(data.value, newData)) return;
        data.value = newData;
    }
    // eventSource.onerror = (error) => console.log('SSE error: ', error);

    return () => eventSource?.close();
}


export async function sendSSE<T>(endpoint: string, body: unknown) {
    return await fetchOrError<T>(endpoint, { method: 'POST', body });
}

export function watchSSE<T>(endpoint: string, handler: (data: T) => void, errorHandler = () => { }) {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => handler(JSON.parse(event.data));
    eventSource.onerror = (_error) => errorHandler();

    return () => eventSource?.close();
}