import { db } from '@/lib/db.ts';
import { define } from '@/lib/utils.ts';

export const handler = define.handlers({
    async GET(ctx) {
        const key = ['data'];
        if (ctx.req.headers.get('accept') === 'text/event-stream') {
            const encoder = new TextEncoder();
            const encoderStream = new TransformStream({
                transform: async (
                    [message]: [Deno.KvEntryMaybe<unknown>],
                    controller,
                ) => {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(message.value)}\n\n`),
                    );
                },
            });
            db.watch([key]).pipeTo(encoderStream.writable).catch((e) => {
                if ('' + e === 'resource closed') return;
                console.log(`Error watching ${key}: ${e}`);
            });
            return new Response(encoderStream.readable, {
                headers: {
                    'content-type': 'text/event-stream',
                },
            });
        }

        return Response.json((await db.get(key)).value);
    },
});
