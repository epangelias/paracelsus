import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { handleAIResponse } from '@/lib/handle-ai.ts';
import { getUserFromState, updateUser } from '@/lib/user.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    const user = await getUserFromState(ctx);
    if (!user) throw new HttpError(401);

    const path = ['chat', user.id];

    if (ctx.req.method == 'GET') {
        const ai = ctx.url.searchParams.get('ai');

        if (ai) {
            if (user.tokens <= 0 && !user.isSubscribed) return await handleSSE(async () => {});

            const res = await db.get<ChatData>(path);

            if (res.versionstamp === null) return Response.error();

            const saveMessages = async (messages: AIMessage[]) => {
                db.set(path, { ...res.value, messages });

                const tokens = (user.tokens || 1) - 1;

                await updateUser({ ...user, tokens });
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
