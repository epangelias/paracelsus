import { define } from '@/lib/utils.ts';
import { handleSSE, watchKV } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';

const path = ['counterData'];

export const handler = define.handlers({
    GET: () => handleSSE(watchKV(path)),
    POST: async (ctx) => {
        await db.set(path, await ctx.req.json());
        return Response.json({});
    },
});
