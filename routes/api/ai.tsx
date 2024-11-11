import { define } from '@/lib/utils.ts';
import { db } from '@/lib/db.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { handleAIResponse } from '@/lib/handle-ai.ts';
import { updateUser } from '@/lib/user.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

const systemPrompt: AIMessage = {
    role: 'system',
    content: '',
};

export const handler = define.handlers({
    GET: async (ctx) => {
        if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);

        const path = ['chat', ctx.state.user.id];
        const cantGenerate = ctx.state.user.tokens <= 0 && !ctx.state.user.isSubscribed;

        if (cantGenerate) throw new HttpError(STATUS_CODE.Unauthorized);

        const res = await db.get<ChatData>(path);

        if (res.versionstamp === null) return Response.error();

        const saveMessages = async (messages?: AIMessage[]) => {
            if (!messages) return;
            db.set(path, { ...res.value, messages });
            const tokens = (ctx.state.user!.tokens || 1) - 1;
            await updateUser({ ...ctx.state.user!, tokens });
        };

        return await handleAIResponse(
            [systemPrompt, ...res.value.messages],
            undefined,
            saveMessages,
            saveMessages,
        );
    },
});
