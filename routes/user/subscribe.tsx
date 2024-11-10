import { define } from '@/lib/utils.ts';
import { getStripePremiumPlanPriceId, isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers(async (ctx) => {
    if (!isStripeEnabled()) throw new HttpError(STATUS_CODE.NotFound);
    const stripePremiumPlanPriceId = getStripePremiumPlanPriceId();
    if (!stripePremiumPlanPriceId) {
        throw new Error('"STRIPE_PREMIUM_PLAN_PRICE_ID" environment variable not set');
    }

    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);

    const { url } = await stripe.checkout.sessions.create({
        success_url: ctx.url.origin + '/user',
        customer: ctx.state.user.stripeCustomerId,
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
