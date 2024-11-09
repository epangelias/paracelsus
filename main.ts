/// <reference lib="deno.unstable" />

import { App, FreshContext, fsRoutes, staticFiles } from "fresh";
import { type State, define } from "@/lib/utils.ts";
import { getUserFromState } from "@/lib/user.ts";

export const app = new App<State>();
app.use(staticFiles());

async function setCatch(ctx: FreshContext) {
  const res = await ctx.next();
  res.headers.set("cache-control", "public, must-revalidate, max-age=" + 60 * 60);
  return res;
}

app.use(define.middleware(async ctx => {
  const base = ctx.req.url.split("/")[3];
  const isStatic = "src|_fresh|img|favicon.ico|manifest.json|css.css".includes(base);
  if (!isStatic) await getUserFromState(ctx);
  if (isStatic && import.meta.main) return setCatch(ctx);
  return await ctx.next();
}))

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}

