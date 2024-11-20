import { App } from 'fresh';
import * as _webPush from 'web-push';
import * as webPushTypes from '@types/web-push';
import { State } from '@/lib/types.ts';
import { site } from '@/lib/site.ts';
import { asset } from 'fresh/runtime';

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

async function sendNotification(subscription: webPushTypes.PushSubscription) {
  const payload = JSON.stringify({ body: 'Hello', icon: asset(site.appIcon), title: site.name });
  const options = { TTL: 60 };

  console.log('Sending Notification...');

  await new Promise((resolve) => setTimeout(resolve, 10000));

  await webPush.sendNotification(subscription, payload, options);

  console.log('Notification sent.');
}

export function EnablePush(app: App<State>) {
  app.get('/api/vapidPublicKey', () => Response.json(VAPID_PUBLIC_KEY));
  app.post('/api/register', async (ctx) => {
    const { subscription } = await ctx.req.json();
    sendNotification(subscription);
    return Response.json({}, { status: 201 })
  }); // Should store the subscription info
}
