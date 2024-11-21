/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import middlewareHandler from '@/lib/middleware.ts';
import { State } from '@/lib/types.ts';
import { enablePush } from '@/lib/push.ts';
import { sendFollowUpsContinuously } from '@/routes/test-push.ts';

export const app = new App<State>();

sendFollowUpsContinuously();

app.use(staticFiles());
app.use(middlewareHandler);

enablePush(app);

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();
