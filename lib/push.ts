import { App, HttpError } from 'fresh';
import * as _webPush from 'web-push';
import * as webPushTypes from '@types/web-push';
import { State } from '@/lib/types.ts';
import { site } from '@/lib/site.ts';
import { asset } from 'fresh/runtime';
import { STATUS_CODE } from '@std/http/status';
import { getUserById, updateUser } from '@/lib/user.ts';

const webPush = _webPush as typeof webPushTypes;

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    'mailto:' + site.email,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
} else {
  console.log(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
    'environment variables. You can use the following ones:',
  );
  console.log(webPush.generateVAPIDKeys());
}

async function sendNotification(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = await getUserById(userId);

  if (!user) return;

  const payload = JSON.stringify({ body: 'Hello, this is Paracelsus', icon: asset(site.appIcon), title: site.name });

  let removedSubscriptions = false;

  console.log('Sending Notifications...');
  for (const subscription of user.pushSubscriptions) {
    console.log('Sending to ', subscription.endpoint);
    try {
      await webPush.sendNotification(subscription, payload, { TTL: 60 });
    } catch (e) {
      removedSubscriptions = true;
      const index = user.pushSubscriptions.indexOf(subscription);
      if (index > -1) user.pushSubscriptions.splice(index, 1);
    }
  }

  if (removedSubscriptions) await updateUser(user);

  console.log('Sent Notifications.');

  return "count:" + user.pushSubscriptions.length;
}

export function EnablePush(app: App<State>) {
  app.get('/api/vapidPublicKey', () => Response.json(VAPID_PUBLIC_KEY));
  app.post('/api/register', async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const { subscription } = await ctx.req.json();
    ctx.state.user.pushSubscriptions.push(subscription);
    await updateUser(ctx.state.user);
    sendNotification(ctx.state.user.id);
    return Response.json({}, { status: 201 })
  });
  app.get('/123', async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const res = await sendNotification(ctx.state.user.id);
    return new Response("sent:" + res, { status: 201 })
  })
}
