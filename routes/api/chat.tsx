import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers(async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);

    const path = ['chat', ctx.state.user.id];

    if (ctx.req.method == 'GET') {
        return handleSSE(watchKV(path));
    } else if (ctx.req.method == 'POST') {
        await db.set(path, await ctx.req.json());
        return Response.json({});
    } else {
        throw new HttpError(STATUS_CODE.MethodNotAllowed);
    }
});
