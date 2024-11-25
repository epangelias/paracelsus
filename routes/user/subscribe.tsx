/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Missing error handling for stripe.checkout.sessions.create call, 
it may throw an error if request to Stripe API fails.

Consider adding validation for ctx.state.user.stripeCustomerId, 
it may be null or undefined.

ctx.url.origin is used without validation, 
it may throw an error if ctx.url is not defined or does not have origin property.

Instead of throwing Error, consider using HttpError for consistency.

The function getStripePremiumPlanPriceId is not validated, 
it may return null or undefined, consider adding validation.

stripe.checkout.sessions.create call is not validated, 
it may return null or undefined, consider adding validation.

The function isStripeEnabled is not validated, 
it may return null or undefined, consider adding validation.

The error message '"STRIPE_PREMIUM_PLAN_PRICE_ID" environment variable not set' 
should be translated or put into a separate constants file for easier maintenance.

Response.error() should be replaced with a more informative error response.

The code can be refactored to reduce the nesting level.
*/


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
