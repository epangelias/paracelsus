import { define } from '@/lib/utils.ts';
import { handleWatchData } from '@/lib/handle-watch.ts';
import { db } from '@/lib/db.ts';

export const handler = define.handlers({
    GET: (ctx) => handleWatchData(ctx, ['counterData']),
    POST: async (ctx) => {
        await db.set(['counterData'], await ctx.req.json());
        return new Response(null, { status: 204 });
    },
});
