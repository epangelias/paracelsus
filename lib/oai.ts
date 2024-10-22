import OpenAI from "https://deno.land/x/openai@v4.28.0/mod.ts";
import {
    ChatCompletionChunk,
    ChatCompletionMessageParam,
} from "https://deno.land/x/openai@v4.28.0/resources/mod.ts";
import { Stream } from "https://deno.land/x/openai@v4.28.0/streaming.ts";

interface OAIOptions {
    baseURL?: string;
    apiKey: string;
    model: string;
}

const backends: Record<string, OpenAI> = {};

export async function generateChatCompletions(
    options: OAIOptions,
    messages: ChatCompletionMessageParam[],
): Promise<
    { stream: Stream<ChatCompletionChunk> } | null
> {
    const backendId = `${options.baseURL}:${options.apiKey}`;

    backends[backendId] = backends[backendId] || new OpenAI({
        apiKey: options.apiKey,
        baseURL: options.baseURL,
    });

    const stream = await backends[backendId].chat.completions.create({
        model: options.model,
        messages,
        stream: true,
    });
    return { stream };
}
