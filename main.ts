/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { pushPlugin } from '@/lib/push.ts';
import { autoSendFollowUps } from '@/app/follow-up.ts';
import { State } from '@/app/types.ts';
import { stripePlugin } from '@/lib/stripe-plugin.ts';
import { userPlugin } from '@/lib/user-plugin.tsx';
import { testingPlugin } from '@/lib/testingPlugin.ts';

export const app = new App<State>();

// Plugins
autoSendFollowUps(app);
stripePlugin(app);
pushPlugin(app);
userPlugin(app);

testingPlugin(app); // Remove for production

app.use(staticFiles());

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();
