import { App, HttpError } from 'fresh';
import * as webPush from 'web-push';
import { State, UserData } from '@/lib/types.ts';
import { site } from '@/lib/site.ts';
import { asset } from 'fresh/runtime';
import { STATUS_CODE } from '@std/http/status';
import { updateUser } from '@/lib/user.ts';

// import * as webPushTypes from '@types/web-push';
// const webPush = _webPush as typeof webPushTypes;

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails('mailto:' + site.email, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.log('To enable notifications, set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY');
  console.log(webPush.generateVAPIDKeys());
}

export async function sendNotificationsToUser(user: UserData, title: string, message: string) {
  let subscriptionRemoved = false;

  for (const subscription of user.pushSubscriptions) {
    try {
      const data = { body: message, icon: asset(site.appIcon), title };
      await webPush.sendNotification(subscription, JSON.stringify(data), { TTL: 60 });
    } catch (e) {
      console.error(e);
      subscriptionRemoved = true;
      const index = user.pushSubscriptions.indexOf(subscription);
      if (index > -1) user.pushSubscriptions.splice(index, 1);
    }
  }

  if (subscriptionRemoved) await updateUser(user);
}

export function enablePush(app: App<State>) {
  app.get('/api/vapid-public-key', () => Response.json(VAPID_PUBLIC_KEY));
  app.post('/api/subscribe-notifications', async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const { subscription } = await ctx.req.json();
    ctx.state.user.pushSubscriptions.push(subscription);
    await updateUser(ctx.state.user);
    return Response.json({}, { status: 201 })
  });
}
