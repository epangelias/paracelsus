import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { handleAIResponse } from '@/lib/handle-ai.ts';

const path = ['chat'];

await db.set(path, { messages: [] });

export const handler = define.handlers({
    GET: async (ctx) => {
        const ai = ctx.url.searchParams.get('ai');

        if (ai) {
            const res = await db.get<ChatData>(path);

            if (res.versionstamp === null) return Response.error();

            const saveMessages = (messages: AIMessage[]) => db.set(path, { ...res.value, messages });

            return await handleAIResponse(res.value.messages, undefined, saveMessages);
        }

        return handleSSE(watchKV(path));
    },
    POST: async (ctx) => {
        await db.set(path, await ctx.req.json());
        return Response.json({});
    },
});
