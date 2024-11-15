import { db } from '@/lib/db.ts';

export function handleSSE(
  handler: (send: (data: unknown) => void) => Promise<void>,
  cancelHandler?: () => void,
) {
  const stream = new ReadableStream({
    start: async (controller) => {
      const send = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      try {
        await handler(send);
      } catch (e) {
        console.error('Error in sse handler:');
        console.error(e);
        controller.error(e);
      }
    },
    cancel: () => {
      if (cancelHandler) cancelHandler();
    },
  });

  const headers = new Headers({ 'Content-Type': 'text/event-stream' });

  return new Response(stream, { headers });
}

export function watchKV(key: Deno.KvKey) {
  return async (send: (d: unknown) => void) => {
    for await (const event of db.watch([key])) {
      if (event[0].versionstamp === null) continue;
      send(event[0].value);
    }
  };
}
