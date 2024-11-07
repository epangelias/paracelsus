import { define } from '@/lib/utils.ts';
import { getUserFromContext } from '../../lib/user.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';

export const handler = define.handlers(async (ctx) => {
    const user = await getUserFromContext(ctx);
    if (!isStripeEnabled() || !user?.stripeCustomerId) return Response.error();
    const { url } = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: ctx.url.origin + '/user',
    });
    return ctx.redirect(url);
});
