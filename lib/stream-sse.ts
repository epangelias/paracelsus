import { db } from '@/lib/utils.ts';

interface Options {
  chunk?: (send: (s: unknown) => void) => void,
  cancel?: () => void,
  watchKey?: Deno.KvKey,
};

export function StreamSSR(options: Options) {
  const stream = new ReadableStream({
    start: (controller) => {
      const send = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(new TextEncoder().encode(message));
        } catch (e) {
          controller.error(e);
        }
      };
      if (options.chunk) options.chunk(send);
      if (options.watchKey) watchKV(options.watchKey, send);
    },
    cancel: options.cancel,
  });

  const headers = new Headers({ 'Content-Type': 'text/event-stream' });

  return new Response(stream, { headers });
}

async function watchKV(key: Deno.KvKey, send: (d: unknown) => void) {
  for await (const event of db.watch([key])) {
    if (event[0].versionstamp === null) continue;
    send(event[0].value);
  }
}
