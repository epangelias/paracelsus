import { handleSSE } from './handle-sse.ts';
import { ChatCompletionChunk } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';
import { generateChatCompletions } from '@/lib/oai.ts';
import { safelyRenderMarkdown } from '@/lib/md.ts';

export function handleAIResponse(messages: AIMessage[], options?: OAIOptions, onEnd = (_messages?: AIMessage[]) => { }, onError = (_messages?: AIMessage[]) => { }) {
    let stream: Stream<ChatCompletionChunk>;

    const message = { role: "assistant", content: "", html: "" };

    return handleSSE(async (send) => {
        try {
            stream = await generateChatCompletions(options, messages.map(({ role, content }) => ({ role, content })));
        } catch (e) {
            onError();
            console.error(e);
        }

        let content = '';

        messages.push(message);

        for await (const token of stream) {
            const deltaContent = token.choices[0].delta.content;

            if (typeof deltaContent == "undefined") break;

            content += token.choices[0].delta.content;

            const html = insertLoaderToHTML(await safelyRenderMarkdown(content))

            message.content = content;
            message.html = html;

            send(message);
        }

        message.html = await safelyRenderMarkdown(content);
        send(message);

        stream.controller.abort();

        send(null);

        onEnd(messages);
    }, async () => {
        message.html = await safelyRenderMarkdown(message.content);
        onError(messages);
        stream?.controller?.abort();
    });
}

function insertLoaderToHTML(html: string) {
    return html.replace(/<\/([^>]+)>\n+$/, `&nbsp;&nbsp;<span class="loader"></span></$1>`);
}