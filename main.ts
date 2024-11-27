/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { pushPlugin } from '@/lib/push.ts';
import { loadUserToContext } from '@/lib/user-data.ts';
import { autoSendFollowUps } from "./app/follow-up.ts";
import { stripePlugin } from '@/lib/stripe.ts';
import { State } from '@/app/types.ts';

export const app = new App<State>();

autoSendFollowUps();
stripePlugin(app)
pushPlugin(app);

app.use(async (ctx) => {
  // Skip static assets
  if (!ctx.req.url.includes('?__frsh_c=')) {
    await loadUserToContext(ctx);
  }
  return await ctx.next();
});

app.use(staticFiles());

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();
