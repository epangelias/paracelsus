import { Signal } from '@preact/signals';
import { IS_BROWSER } from 'fresh/runtime';
import { useEffect, useRef } from 'preact/hooks';
import { Trigger } from '@/lib/types.ts';

// Next, add param to limit amount of changes per period of time, and delay before changes

export function watchData<T>(endpoint: string, data: Signal<T>, triggers: Record<string, (trigger: Trigger<T>) => void> = {}) {
    triggers = {
        change(trigger) {
            alert();
            if (JSON.stringify(data.value) === JSON.stringify(trigger.value)) return;
            if (trigger.value == null) return;
            trigger.saveData(trigger.value as T);
            trigger.respond('change', trigger.value);
        },
        ...triggers,
    };

    function sendTrigger(name: string, value?: unknown) {
        const handler = triggers[name] || (() => { });

        const trigger: Trigger<T> = {
            name, value, data: data.value,
            respond(n, v) {
                if (!websocketRef.current || websocketRef.current.readyState !== 1) return;
                websocketRef.current.send(JSON.stringify({ name: n, value: v }));
            },
            async saveData(changedData: T = data.value) {
                data.value = changedData;
            }
        }

        handler(trigger);
    }

    const websocketRef = useRef<WebSocket | null>(null);

    function receiveData(res: string) {
        const { name, value } = JSON.parse(res);
        sendTrigger(name, value);
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

    useEffect(() => sendTrigger("change", data.value), [data.value]);

    useEffect(() => {
        connect();
        return () => websocketRef.current?.close();
    }, []);


    return (name: string, value?: unknown) => websocketRef.current?.send(JSON.stringify({ name, value }));;
}
