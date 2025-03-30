#!/usr/bin/env -S deno run -A --env
/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { pushPlugin } from '@/lib/pwa/push.ts';
import { autoSendFollowUps } from '@/app/follow-up.ts';
import { State } from './lib/utils.ts';
import { stripePlugin } from '@/lib/stripe/stripe-plugin.ts';
import { userPlugin } from '@/lib/user/user-plugin.tsx';
import { adminPlugin } from '@/lib/user/admin-plugin.ts';
import { manifestPlugin } from '@/lib/pwa/manifest-plugin.ts';
import { isProductionMode, setProductionMode } from './lib/utils.ts';
import { compileCSS } from './.archive/css.ts';
import { OauthPlugin } from '@/lib/oauth.ts';

export const app = new App<State>();

setProductionMode(import.meta.main);

autoSendFollowUps(app);
stripePlugin(app);
pushPlugin(app);
userPlugin(app);
manifestPlugin(app);
adminPlugin(app);
OauthPlugin(app);

app.use(staticFiles());

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (isProductionMode()) await app.listen();
