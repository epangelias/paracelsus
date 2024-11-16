import { getUserFromState } from '@/lib/user.ts';
import { isProduction } from '@/main.ts';
import { define } from '@/lib/utils.ts';

export function setCatchHeader(res: Response) {
  res.headers.set('cache-control', 'public, must-revalidate, max-age=' + 60); // ONE MINUTE, CHANGE LATER
  return res;
}

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

  if (isStatic && isProduction) setCatchHeader(res);

  return res;
});
