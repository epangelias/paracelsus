/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from "fresh";
import { type State, define } from "@/lib/utils.ts";
import { getUserFromState } from "@/lib/user.ts";
import { BadRequestError, isStaticAsset, setCatchHeader, UnauthorizedError } from '@/lib/http.ts';
import { STATUS_CODE, STATUS_TEXT } from '@std/http/status';

export const app = new App<State>();
export const isProduction = import.meta.main;

app.use(staticFiles());

export function toErrorStatus(error: Error) {
  if (error instanceof Deno.errors.NotFound) return STATUS_CODE.NotFound;
  if (error instanceof UnauthorizedError) return STATUS_CODE.Unauthorized;
  if (error instanceof BadRequestError) return STATUS_CODE.BadRequest;
  return STATUS_CODE.InternalServerError;
}

app.use(define.middleware(async ctx => {

  if (ctx.url.pathname.includes("/api")) {
    try {
      return await ctx.next();
    } catch (e) {
      const status = toErrorStatus(e);
      return new Response(e.message, {
        statusText: STATUS_TEXT[status],
        status,
      });
    }
  }

  try {

    const isStatic = isStaticAsset(ctx.req);

    if (!isStatic) await getUserFromState(ctx);

    const res = await ctx.next();

    if (isStatic && isProduction) setCatchHeader(res);

    return res;
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return ctx.redirect("/user/signin");
    }
    throw e;
  }


}));

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (isProduction) await app.listen();

