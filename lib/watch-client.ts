

export function watchClient<T>(endpoint: string, callback: (data: T) => void) {
    let websocket: WebSocket;
    let reconnectAttempts = 0;

    function connect() {
        websocket = new WebSocket(endpoint);

        websocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            callback(data);
        };

        websocket.onclose = () => reconnect();

        websocket.onerror = (_error) => websocket.close();
    }

    async function reconnect() {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        reconnectAttempts += 1;
        console.log(`Reconnecting... attempt ${reconnectAttempts}`);
        connect();
    }

    connect();

    return () => {
        websocket.close();
        reconnectAttempts = 0;
    };
}
