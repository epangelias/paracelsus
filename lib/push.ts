import { App, HttpError } from 'fresh';
import * as _webPush from 'web-push';
import { site } from '@/app/site.ts';
import { asset } from 'fresh/runtime';
import { STATUS_CODE } from '@std/http/status';
import { setUserData } from '@/lib/user-data.ts';
import { State, UserData } from '@/app/types.ts';

import * as webPushTypes from 'npm:@types/web-push';
const webPush = _webPush as typeof webPushTypes;

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') as string;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') as string;

let waiting: void | true = true;

export function isPushEnabled() {
  return VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY;
}


if (!isPushEnabled()) {
  console.warn('Notifications disabled, set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY');
  // console.log(webPush.generateVAPIDKeys());
}

export async function sendNotificationToUser(user: UserData, title: string, message: string) {
  if (waiting) waiting = webPush.setVapidDetails('mailto:' + site.email, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  if (!isPushEnabled()) return;

  let subscriptionRemoved = false;

  for (const subscription of user.pushSubscriptions) {
    try {
      const data = { body: message, icon: site.icon, title };
      await webPush.sendNotification(subscription, JSON.stringify(data), { TTL: 60 });
    } catch (e) {
      if (e?.statusCode == STATUS_CODE.Gone) {
        // Removes subscription on error, change later
        console.log('Subscription gone, removing it', subscription, e);
        subscriptionRemoved = true;
        const index = user.pushSubscriptions.indexOf(subscription);
        if (index > -1) user.pushSubscriptions.splice(index, 1);
      } else console.error('Error sending to ' + subscription.endpoint, e);
    }
  }

  if (subscriptionRemoved) await setUserData(user);
}

export function pushPlugin(app: App<State>) {
  app.get('/api/vapid-public-key', () => Response.json(VAPID_PUBLIC_KEY));
  app.post('/api/subscribe-notifications', async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const { subscription } = await ctx.req.json();
    ctx.state.user.pushSubscriptions.push(subscription);
    await setUserData(ctx.state.user);
    return Response.json({}, { status: 201 });
  });
}
