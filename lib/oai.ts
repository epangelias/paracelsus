import OpenAI from "https://deno.land/x/openai@v4.28.0/mod.ts";
import {
    ChatCompletionChunk,
    ChatCompletionMessageParam,
} from "https://deno.land/x/openai@v4.28.0/resources/mod.ts";
import { Stream } from "https://deno.land/x/openai@v4.28.0/streaming.ts";
import { AIMessage, OAIOptions } from '@/lib/types.ts';


const backends: Record<string, OpenAI> = {};

const defaultTestOptions = { apiKey: 'ollama', baseURL: 'http://localhost:11434/v1', model: 'llama3.2:1b-instruct-q4_K_M', };

export async function generateChatCompletions(
    options: OAIOptions = defaultTestOptions,
    messages: AIMessage[],
) {
    const backendId = `${options.baseURL}:${options.apiKey}`;

    backends[backendId] = backends[backendId] || new OpenAI({
        apiKey: options.apiKey,
        baseURL: options.baseURL,
    });

    return await backends[backendId].chat.completions.create({
        model: options.model,
        messages: messages as ChatCompletionMessageParam[],
        stream: true,
    });
}
