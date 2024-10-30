import { db } from '@/lib/db.ts';
import { define } from '@/lib/utils.ts';

export const handler = define.handlers({
    GET(ctx) {
        const key = ['data'];

        if (ctx.req.headers.get('upgrade') != 'websocket') return new Response(null, { status: 501 });

        const { socket, response } = Deno.upgradeWebSocket(ctx.req);
        let currentData = '';

        socket.onopen = async () => {
            for await (const _event of db.watch([key])) {
                const { value } = await db.get(key);
                const json = JSON.stringify(value);
                if (json == currentData) continue;
                currentData = json;
                if (socket.readyState == 1) socket.send(json);
            }
        };

        socket.onerror = (event) => {
            console.log(`Error watching ${key}: ${event}`);
        };

        socket.onmessage = (event) => {
            currentData = event.data;
            db.set(key, JSON.parse(event.data));
        };

        return response;
    },
});
