import OpenAI from 'https://deno.land/x/openai@v4.28.0/mod.ts';
import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';

const backends: Record<string, OpenAI> = {};

const defaultTestOptions = {
  apiKey: Deno.env.get('AI_API_KEY') || 'ollama',
  baseURL: Deno.env.get('AI_URL') || 'http://localhost:11434/v1',
  model: Deno.env.get('AI_MODEL') || 'llama3.2:1b-instruct-q4_K_M',
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

  backends[backendId] = backends[backendId] || new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
  });

  return await backends[backendId].chat.completions.create({
    model: options.model,
    messages: messages as ChatCompletionMessageParam[],
    stream,
  }) as unknown as OpenAI.ChatCompletion;
}
