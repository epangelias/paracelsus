import { IS_BROWSER } from 'fresh/runtime';


export function watchClient<T>(endpoint: string, callback: (data: T) => void) {
    const websocket = new WebSocket(endpoint);

    websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        callback(data);
    };

    return () => websocket.close()
};