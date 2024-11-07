import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { handleAIResponse } from '@/lib/handle-ai.ts';
import { getUserFromContext, updateUser } from '@/lib/user.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    const user = await getUserFromContext(ctx);
    if (!user) throw new HttpError(401);

    const path = ['chat', user.id];

    if (ctx.req.method == 'GET') {
        const ai = ctx.url.searchParams.get('ai');

        if (ai) {
            if (!user.isSubscribed) {
                if (user.tokens <= 0) throw new HttpError(402, 'Out of tokens');
                await updateUser({ ...user, tokens: (user.tokens || 0) - 1 });
            }

            const res = await db.get<ChatData>(path);

            if (res.versionstamp === null) return Response.error();

            const saveMessages = (messages: AIMessage[]) =>
                db.set(path, { ...res.value, messages });

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
