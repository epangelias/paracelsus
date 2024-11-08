import { define } from '@/lib/utils.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    if (!isStripeEnabled()) throw new HttpError(404);
    if (!ctx.state.user?.stripeCustomerId) throw new HttpError(401);
    const { url } = await stripe.billingPortal.sessions.create({
        customer: ctx.state.user.stripeCustomerId,
        return_url: ctx.url.origin + '/user',
    });
    return ctx.redirect(url);
});
