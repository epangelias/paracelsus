import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { handleAIResponse } from '@/lib/handle-ai.ts';
import { updateUser } from '@/lib/user.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    if (!ctx.state.user) throw new HttpError(401);

    const path = ['chat', ctx.state.user.id];

    if (ctx.req.method == 'GET') {
        const ai = ctx.url.searchParams.get('ai');

        if (ai) {
            if (ctx.state.user.tokens <= 0 && !ctx.state.user.isSubscribed) {
                return await handleSSE(async () => {});
            }

            const res = await db.get<ChatData>(path);

            if (res.versionstamp === null) return Response.error();

            const saveMessages = async (messages: AIMessage[]) => {
                db.set(path, { ...res.value, messages });

                const tokens = (ctx.state.user!.tokens || 1) - 1;

                await updateUser({ ...ctx.state.user!, tokens });
            };

            return await handleAIResponse(res.value.messages, undefined, saveMessages);
        }

        return handleSSE(watchKV(path));
    } else if (ctx.req.method == 'POST') {
        await db.set(path, await ctx.req.json());
        return Response.json({});
    } else {
        throw new HttpError(405);
    }
});
