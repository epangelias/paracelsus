import { Signal } from '@preact/signals';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect, useRef } from 'preact/hooks';

export function watchData<T>(endpoint: string, data: Signal<T>) {
    if (!IS_BROWSER) return;

    useEffect(() => {
        const eventSource = new EventSource(endpoint);

        eventSource.onmessage = (e) => data.value = JSON.parse(e.data);
        eventSource.onerror = (error) => console.log('SSE error: ', error);

        return () => eventSource?.close();
    }, [endpoint]);
}
