/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from "fresh";
import { type State, define } from "@/lib/utils.ts";
import { getUserFromState } from "@/lib/user.ts";
import { isStaticAsset, setCatchHeader } from '@/lib/http.ts';

export const app = new App<State>();
export const isProduction = import.meta.main;

app.use(staticFiles());

app.use(define.middleware(async ctx => {
  const res = await ctx.next();
  const isStatic = isStaticAsset(ctx.req);

  if (!isStatic) await getUserFromState(ctx);
  if (isStatic && isProduction) setCatchHeader(res);

  return res;
}));

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (isProduction) await app.listen();

