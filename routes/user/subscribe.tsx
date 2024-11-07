import { define } from '@/lib/utils.ts';
import { getStripePremiumPlanPriceId, isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { getUserFromContext } from '../../lib/user.ts';
import { ServerCodePage } from '@/routes/_404.tsx';

export const handler = define.handlers(async (ctx) => {
    if (!isStripeEnabled()) return ctx.render(ServerCodePage());
    const stripePremiumPlanPriceId = getStripePremiumPlanPriceId();
    if (!stripePremiumPlanPriceId) {
        throw new Error('"STRIPE_PREMIUM_PLAN_PRICE_ID" environment variable not set');
    }

    const user = await getUserFromContext(ctx);

    if (!user) {
        return ctx.render(ServerCodePage({ codeDescription: 'Unauthorized', serverCode: 401 }));
    }

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
