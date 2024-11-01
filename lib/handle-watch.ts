import { FreshContext } from 'fresh';
import { db } from '@/lib/db.ts';
import { Trigger } from '@/lib/types.ts';



export function handleWatchData<T>(ctx: FreshContext, key: Deno.KvKey, triggers: Record<string, (trigger: Trigger<T>) => void> = {}) {
    if (ctx.req.headers.get('upgrade') != 'websocket') return new Response(null, { status: 501 });

    let data: T;

    triggers = {
        change(trigger) {
            if (JSON.stringify(data) === JSON.stringify(trigger.value)) return;
            trigger.saveData(trigger.value as T);
            trigger.respond('change', trigger.value);
        },
        ...triggers,
    };

    const { socket, response } = Deno.upgradeWebSocket(ctx.req);

    function sendTrigger(name: string, value?: unknown) {

        const handler = triggers[name] || (() => { });
        if (!handler) return;

        const trigger: Trigger<T> = {
            name, value, data,
            respond(n, v) {
                if (socket.readyState !== 1) return;
                socket.send(JSON.stringify({ name: n, value: v }));
            },
            async saveData(changedData: T = data) {
                data = changedData;
                await db.set(key, changedData);
            }
        }

        handler(trigger);
    }

    socket.onopen = async () => {
        for await (const _event of db.watch([key])) {
            const res = await db.get<T>(key);
            if (res.versionstamp !== null) sendTrigger("change", res.value);
        }
    };

    socket.onerror = (event) => {
        console.log(`Error watching ${key}: ${event}`);
    };

    socket.onmessage = (event) => {
        const { name, value } = JSON.parse(event.data);
        sendTrigger(name, value);
    };

    return response;
}