import { StreamSSR } from '@/lib/stream-sse.ts';
import { ChatCompletionChunk } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';
import { generateChatCompletionStream } from '@/lib/oai.ts';
import { renderMarkdown } from '@/lib/md.ts';

interface Options {
  messages: AIMessage[];
  options?: OAIOptions;
  onChunk?: (messages: AIMessage[]) => void;
  onEnd?: (messages: AIMessage[]) => void;
  onError?: (messages: AIMessage[]) => void;
  onCancel?: (messages: AIMessage[]) => void;
}

export function StreamAI({ messages, options, onChunk, onEnd, onError, onCancel }: Options) {
  let stream: Stream<ChatCompletionChunk>;

  const message = { role: 'assistant', content: '', html: '' };

  return StreamSSR({
    async onChunk(send) {
      try {
        stream = await generateChatCompletionStream(options, messages);
        if (stream instanceof Stream == false) throw new Error('Invalid stream');
        if (onChunk) onChunk(messages);
      } catch (e) {
        if (onError) onError(messages);
        stream?.controller.abort();
        console.error(e);
      }

      let content = '';

      messages.push(message);

      for await (const token of stream) {
        const deltaContent = token.choices[0].delta.content;
        if (typeof deltaContent == 'undefined') break;
        content += deltaContent;
        const html = insertLoaderToHTML(await renderMarkdown(content));
        message.content = content;
        message.html = html;
        send(message);
      }

      message.html = await renderMarkdown(content);
      send(message);
      stream.controller.abort();
      send(null);

      if (onEnd) onEnd(messages);
    },
    async onCancel() {
      message.html = await renderMarkdown(message.content);
      if (onCancel) onCancel(messages);
      stream?.controller?.abort();
    },
  });
}

function insertLoaderToHTML(html: string) {
  return html.replace(/<\/([^>]+)>\n+$/, `&nbsp;&nbsp;<span class="loader"></span></$1>`);
}
