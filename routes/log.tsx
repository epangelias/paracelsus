import { define } from '@/lib/utils.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        const json = await ctx.req.json();
        console.log('\nLOGGING DATA\n\n');
        console.log(json);
        return new Response();
    },
});
