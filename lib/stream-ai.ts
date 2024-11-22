import { StreamSSR } from './stream-sse.ts';
import { ChatCompletionChunk } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';
import { generateChatCompletionStream } from '@/lib/oai.ts';
import { safelyRenderMarkdown } from '@/lib/md.ts';

interface Options {
  messages: AIMessage[];
  options?: OAIOptions;
  chunk?: (send: (s: unknown) => void) => void;
  end?: (messages: AIMessage[]) => void;
  error?: (messages: AIMessage[]) => void;
  cancel?: (messages: AIMessage[]) => void;
}

export function StreamAI(options: Options) {
  let stream: Stream<ChatCompletionChunk>;

  const message = { role: 'assistant', content: '', html: '' };

  return StreamSSR({
    async chunk(send) {
      try {
        stream = await generateChatCompletionStream(
          options.options,
          options.messages.map(({ role, content }) => ({ role, content })),
        );
        if (stream instanceof Stream == false) throw new Error('Invalid stream');
      } catch (e) {
        if (options.error) options.error(options.messages);
        stream?.controller.abort();
        console.error(e);
      }

      let content = '';

      options.messages.push(message);

      for await (const token of stream) {
        const deltaContent = token.choices[0].delta.content;

        if (typeof deltaContent == 'undefined') break;

        content += deltaContent;

        const html = insertLoaderToHTML(await safelyRenderMarkdown(content));

        message.content = content;
        message.html = html;

        send(message);
      }

      message.html = await safelyRenderMarkdown(content);
      send(message);

      stream.controller.abort();

      send(null);

      if (options.end) options.end(options.messages);
    },
    async cancel() {
      message.html = await safelyRenderMarkdown(message.content);
      if (options.cancel) options.cancel(options.messages);
      stream?.controller?.abort();
    },
  });
}

function insertLoaderToHTML(html: string) {
  return html.replace(/<\/([^>]+)>\n+$/, `&nbsp;&nbsp;<span class="loader"></span></$1>`);
}
