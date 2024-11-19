

import { App } from 'fresh';
import * as webPush from "web-push";
import { State } from '@/lib/types.ts';

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log(
        "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
        "environment variables. You can use the following ones:"
    );
    console.log(webPush.generateVAPIDKeys());
}

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
        "https://paracelsus.vaza.app",
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}


export function EnablePush(app: App<State>) {
    app.get("/vapidPublicKey", () => new Response(VAPID_PUBLIC_KEY));
    app.post("/register", () => new Response(null, { status: 201 })); // Should store the subscription info
    app.post("/sendNotification", async (ctx) => {
        const { subscription, TTL, delay } = await ctx.req.json();
        const payload = null;
        const options = { TTL };

        console.log("sending Notification...");

        await new Promise(resolve => setTimeout(resolve, delay * 1000));

        await webPush.sendNotification(subscription, payload, options);
        return new Response(null, { status: 201 });
    })
}