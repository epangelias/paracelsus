import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { define } from '@/lib/utils.ts';
import { BadRequestError } from '@/lib/http.ts';
import Stripe from "stripe";
import { getUserByStripeCustomer, updateUser } from '../../lib/user.ts';
import { STATUS_CODE } from '@std/http/status';

const cryptoProvider = Stripe.createSubtleCryptoProvider();

export const handler = define.handlers({
    POST: async ctx => {
        if (!isStripeEnabled()) throw new Deno.errors.NotFound("Not Found");

        const body = await ctx.req.text();
        const signature = ctx.req.headers.get("stripe-signature");
        if (signature === null) {
            throw new BadRequestError("`Stripe-Signature` header is missing");
        }
        const signingSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
        if (signingSecret === undefined) {
            throw new Error(
                "`STRIPE_WEBHOOK_SECRET` environment variable is not set",
            );
        }

        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                signingSecret,
                undefined,
                cryptoProvider,
            );
        } catch (error) {
            throw new BadRequestError(error.message);
        }

        const { customer } = event.data.object as { customer: string };

        console.log("TEST received hook: " + event.type);

        switch (event.type) {
            case "customer.subscription.created": {
                const user = await getUserByStripeCustomer(customer);
                if (!user) throw new Deno.errors.NotFound("User not found");

                await updateUser({ ...user, isSubscribed: true });
                return new Response(null, { status: STATUS_CODE.Created });
            }
            case "customer.subscription.deleted": {
                const user = await getUserByStripeCustomer(customer);
                if (!user) throw new Deno.errors.NotFound("User not found");

                await updateUser({ ...user, isSubscribed: false });
                return new Response(null, { status: STATUS_CODE.Accepted });
            }
            default: {
                throw new BadRequestError("Event type not supported");
            }
        }
    }
})