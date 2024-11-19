import { getUserFromState } from '@/lib/user.ts';
import { define } from '@/lib/utils.ts';

export function isStaticAsset(req: Request) {
  const base = req.url.split('/')[3];
  if (req.method == 'POST' || base === '') return false;
  const isStatic = 'src|_fresh|img|favicon.ico|manifest.json|css.css'.includes(base);
  return isStatic;
}

export default define.middleware(async (ctx) => {
  const isStatic = isStaticAsset(ctx.req);

  if (!isStatic) await getUserFromState(ctx);

  const res = await ctx.next();

  return res;
});
