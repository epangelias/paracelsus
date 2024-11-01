import { FreshContext } from 'fresh';
import { db } from '@/lib/db.ts';

export function handleWatchData(ctx: FreshContext, key: Deno.KvKey) {

    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            for await (const _event of db.watch([key])) {
                console.log("CHANGE\n\n")
                const { value } = await db.get(key);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(value)}\n\n`));
            }
        },
    });

    return new Response(stream, { headers });
}
