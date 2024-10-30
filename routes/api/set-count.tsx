import { define } from '@/lib/utils.ts';
import { db } from '@/lib/db.ts';

export const handler = define.handlers({
    async GET(ctx) {
        const count = ctx.url.searchParams.get('count') ?? 0;
        await db.set(['data'], { count: +count });
        return new Response(null, { status: 200 });
    },
});
