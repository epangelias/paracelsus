import { define } from '@/lib/utils.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers(async (ctx) => {
  if (!isStripeEnabled()) throw new HttpError(STATUS_CODE.NotFound);
  if (!ctx.state.user?.stripeCustomerId) throw new HttpError(STATUS_CODE.Unauthorized);
  const { url } = await stripe.billingPortal.sessions.create({
    customer: ctx.state.user.stripeCustomerId,
    return_url: ctx.url.origin + '/user',
  });
  return ctx.redirect(url);
});
