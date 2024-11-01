import { Signal } from '@preact/signals';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect, useRef } from 'preact/hooks';

// Next, add param to limit amount of changes per period of time, and delay before changes

export function watchData<T>(endpoint: string, data: Signal<T>) {
    if (!IS_BROWSER) return;

    const websocketRef = useRef<WebSocket>(new WebSocket(endpoint));
    const currentDataRef = useRef("");

    websocketRef.current.onmessage = (e) => receiveData(e.data);
    websocketRef.current.onerror = (error) => console.log('WebSocket error: ', error.type);

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

    useEffect(() => updateData(), [data.value]);
    useEffect(() => () => websocketRef.current?.close(), []);
}