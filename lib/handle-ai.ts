import { handleSSE } from './handle-sse.ts';
import { ChatCompletionChunk } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';
import { generateChatCompletions } from '@/lib/oai.ts';
import { safelyRenderMarkdown } from '@/lib/md.ts';

export function handleAIResponse(messages: AIMessage[], options?: OAIOptions, onEnd = (_messages?: AIMessage[]) => { }, onError = (_messages?: AIMessage[]) => { }) {
    let stream: Stream<ChatCompletionChunk>;

    return handleSSE(async (send) => {
        try {
            stream = await generateChatCompletions(options, messages.map(({ role, content }) => ({ role, content })));
        } catch (e) {
            onError();
            console.error(e);
        }

        let content = '';

        messages.push({ role: "assistant", content: "", html: "" })

        for await (const token of stream) {
            const deltaContent = token.choices[0].delta.content;

            if (typeof deltaContent == "undefined") break;

            content += token.choices[0].delta.content;
            const message = {
                role: "assistant",
                content,
                html: await safelyRenderMarkdown(content)
            }

            messages[messages.length - 1] = message;

            send(message);
        }

        stream.controller.abort();

        send(null);

        onEnd(messages);
    }, () => {
        onError(messages);
        stream.controller.abort();
    });
}