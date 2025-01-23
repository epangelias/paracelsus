import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/stream/types.ts';
import { LruCache } from 'jsr:@std/cache';

const cache = new LruCache<string, OpenAI>(100);

const defaultTestOptions: OAIOptions = {
  model: Deno.env.get('OPENAI_MODEL') || 'llama3.2:1b',
  baseURL: Deno.env.get('OPENAI_BASE_URL'),
  apiKey: Deno.env.get('OPENAI_API_KEY'),
};

export async function generateChatCompletionStream(
  options: OAIOptions = defaultTestOptions,
  messages: AIMessage[],
) {
  return await generateChatCompletion(options, messages, true) as unknown as Stream<
    OpenAI.ChatCompletionChunk
  >;
}

export async function generateChatCompletion(
  options: OAIOptions = defaultTestOptions,
  messages: AIMessage[],
  stream = false,
) {
  messages = messages.map(({ role, content }) => ({ role, content }));

  const backendId = `${options.baseURL}:${options.apiKey}`;

  const backend = cache.has(backendId) ? cache.get(backendId)! : cache.set(
    backendId,
    new OpenAI({ baseURL: options.baseURL, apiKey: options.apiKey }),
  ).get(backendId)!;

  return await backend.chat.completions.create({
    model: options.model,
    messages: messages as ChatCompletionMessageParam[],
    stream,
  }) as unknown as OpenAI.ChatCompletion;
}
