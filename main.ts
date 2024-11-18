/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import middlewareHandler from '@/lib/middleware.ts';
import { State } from '@/lib/types.ts';

export const app = new App<State>();
export const isProduction = import.meta.main;

app.use(staticFiles());
app.use(middlewareHandler);

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (isProduction) await app.listen();
