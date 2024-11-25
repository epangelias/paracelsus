/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Error handling is good, Throw HttpError with appropriate status code.

isStripeEnabled and stripe.billingPortal.sessions.create are not await, 
make sure they are not async functions.

ctx.state.user?.stripeCustomerId is accessing nested property, 
consider adding null/undefined checks for each property.

ctx.url.origin is used, but what if ctx.url is null or undefined? 
Add a null check before accessing its properties.

Consider adding a try-catch block to handle any unexpected errors.

No performance issues found.

Code style is good, using async/await and concise syntax.

A small refactor could be to extract the conditions for throwing HttpError into separate functions for readability.
*/


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
