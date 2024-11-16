/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { type State } from '@/lib/utils.ts';
import middlewareHandler from '@/lib/middleware.ts';
import { UserMod } from './mods/user/mod.ts';

export const app = new App<State>();
export const isProduction = import.meta.main;

UserMod(app);

app.use(staticFiles());
app.use(middlewareHandler);

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (isProduction) await app.listen();
