import { Signal } from '@preact/signals';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect, useRef } from 'preact/hooks';

// Next, add param to limit amount of changes per period of time, and delay before changes

export function watchData<T>(endpoint: string, data: Signal<T>) {
    if (!IS_BROWSER) return;

    const websocketRef = useRef<WebSocket | null>(null);
    const currentDataRef = useRef("");

    function connect() {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) return;

        websocketRef.current = new WebSocket(endpoint);

        websocketRef.current.onmessage = (e) => {
            currentDataRef.current = e.data;
            data.value = JSON.parse(e.data);
        }
        websocketRef.current.onerror = (error) => {
            console.log('WebSocket error: ', error.type);
        };
        websocketRef.current.onopen = () => console.log("opened websocket");
    }

    // globalThis.addEventListener('focus', () => {
    //     document.visibilityState === 'visible' && connect()
    // });

    useEffect(() => {
        const json = JSON.stringify(data.value);
        if (websocketRef.current?.readyState !== WebSocket.OPEN || json == currentDataRef.current) return;
        currentDataRef.current = json;
        websocketRef.current?.send(json);
    }, [data.value]);

    useEffect(() => {
        connect();
        return () => websocketRef.current?.close();
    }, []);
}
