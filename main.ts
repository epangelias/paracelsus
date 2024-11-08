/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from "fresh";
import { type State, define } from "@/lib/utils.ts";
import { getUserFromState } from "@/lib/user.ts";

export const app = new App<State>();
app.use(staticFiles());

app.use(define.middleware(async ctx => {
  await getUserFromState(ctx);
  return ctx.next();
}))

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
