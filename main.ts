/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import middlewareHandler from '@/lib/middleware.ts';
import { State } from '@/lib/types.ts';
import { asset } from 'fresh/runtime';

export const app = new App<State>();

app.use(staticFiles());
app.use(middlewareHandler);

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();