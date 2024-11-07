import { define } from '@/lib/utils.ts';
import { getStripePremiumPlanPriceId, isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { getUserFromContext } from '../../lib/user.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    if (!isStripeEnabled()) throw new HttpError(404);
    const stripePremiumPlanPriceId = getStripePremiumPlanPriceId();
    if (!stripePremiumPlanPriceId) {
        throw new Error('"STRIPE_PREMIUM_PLAN_PRICE_ID" environment variable not set');
    }

    const user = await getUserFromContext(ctx);

    if (!user) throw new HttpError(401, 'Unauthorized');

    const { url } = await stripe.checkout.sessions.create({
        success_url: ctx.url.origin + '/user',
        customer: user.stripeCustomerId,
        line_items: [
            {
                price: stripePremiumPlanPriceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
    });
    if (url === null) return Response.error();

    return ctx.redirect(url);
});
