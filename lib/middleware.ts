import { getUserFromState } from "@/lib/user.ts";
import { isStaticAsset, setCatchHeader } from '@/lib/http.ts';
import { isProduction } from '@/main.ts';
import { define } from '@/lib/utils.ts';

export default define.middleware(async ctx => {

    const isStatic = isStaticAsset(ctx.req);

    if (!isStatic) await getUserFromState(ctx);

    const res = await ctx.next();

    if (isStatic && isProduction) setCatchHeader(res);

    return res;

});