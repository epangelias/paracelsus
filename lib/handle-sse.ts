import { db } from '@/lib/db.ts';

export function handleSSE(handler: (send: (data: unknown) => void) => Promise<void>, cancelHandler?: () => void) {

    const stream = new ReadableStream({
        start: async (controller) => {

            await handler(data => {
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
            });

        },
        cancel: () => {
            if (cancelHandler) cancelHandler();
        }
    });

    const headers = new Headers({ 'Content-Type': 'text/event-stream', });

    return new Response(stream, { headers });
}


export function watchKV(key: Deno.KvKey) {
    return async (send: (d: unknown) => void) => {
        for await (const event of db.watch([key])) {
            send(event[0].value);
        }
    }
}