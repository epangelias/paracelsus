import { Signal } from '@preact/signals';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect, useRef } from 'preact/hooks';

// Next, add param to limit amount of changes per period of time, and delay before changes

export function watchData<T>(endpoint: string, data: Signal<T>) {
    if (!IS_BROWSER) return;

    const websocketRef = useRef<WebSocket | null>(null);
    const currentDataRef = useRef("");

    function receiveData(res: string) {
        const value = JSON.parse(res);
        if (value === null) return;
        currentDataRef.current = res;
        data.value = value;
    }

    function updateData() {
        const json = JSON.stringify(data.value);
        if (websocketRef.current?.readyState !== WebSocket.OPEN || json == currentDataRef.current) return;
        currentDataRef.current = json;
        websocketRef.current?.send(json);
    }

    function connect() {
        if (websocketRef.current?.readyState === WebSocket.OPEN) return;
        websocketRef.current = new WebSocket(endpoint);
        websocketRef.current.onmessage = (e) => receiveData(e.data);
        websocketRef.current.onerror = (error) => console.log('WebSocket error: ', error.type);
    }

    // globalThis.addEventListener('focus', () => {
    //     document.visibilityState === 'visible' && connect()
    // });

    useEffect(() => updateData(), [data.value]);

    useEffect(() => {
        connect();
        return () => websocketRef.current?.close();
    }, []);
}


export function watchDataList<T>(endpoint: string, data: Signal<T[]>) {
    if (!IS_BROWSER) return;

    const websocketRef = useRef<WebSocket | null>(null);

    function receiveData(res: string) {
        alert(res);
        const values = JSON.parse(res);
        if (values === null) return;
        data.value = [...data.value, ...values];
    }

    function updateData() {
        if (websocketRef.current?.readyState !== WebSocket.OPEN) return;
        const json = JSON.stringify(data.value);
        websocketRef.current?.send(json);
    }

    function connect() {
        if (websocketRef.current?.readyState === WebSocket.OPEN) return;
        websocketRef.current = new WebSocket(endpoint);
        websocketRef.current.onmessage = (e) => receiveData(e.data);
        websocketRef.current.onerror = (error) => console.log('WebSocket error: ', error.type);
    }

    useEffect(() => updateData(), [data.value]);

    useEffect(() => {
        connect();
        return () => websocketRef.current?.close();
    }, []);
}
