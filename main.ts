/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { State } from '@/lib/types.ts';
import { PushPlugin } from '@/lib/push.ts';
import { getUserFromState } from '@/lib/user-data.ts';
import { AutoSendFollowUps } from '@/app/follow-up.ts';

export const app = new App<State>();

// AutoSendFollowUps();
PushPlugin(app);

app.use(async (ctx) => {
  // Skip static assets
  if (!ctx.req.url.includes('?__frsh_c='))
    await getUserFromState(ctx);
  return await ctx.next();
});

app.use(staticFiles());

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();
