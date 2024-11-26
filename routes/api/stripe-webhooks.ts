/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code is generally well-structured and follows best practices.

One potential security issue is the use of `console.log` with user input (`event.type`), 
which could lead to a security vulnerability if `event.type` contains user-controlled data.

A performance improvement could be made by handling the `getUserByStripeCustomer` call 
in parallel with the `GetStripeWebhookEvent` call using `Promise.all` or similar 
techniques, as these calls seem to be independent.

The code follows a consistent coding style and is readable.

It would be beneficial to add error handling for the `updateUser` calls, 
in case the update operation fails.

The use of `define.handlers` and the `handler` function seems to be a good practice, 
as it separates the route handling logic from the main application logic.

No major refactoring opportunities are seen in this code snippet.

It would be a good idea to add more logging or monitoring for the cases where 
an `HttpError` is thrown, to track and analyze these errors.
*/


import { define } from '@/lib/utils.ts';
import { getUserByStripeCustomer, setUserData } from '@/lib/user-data.ts';
import { STATUS_CODE } from '@std/http/status';
import { HttpError } from 'fresh';
import { GetStripeWebhookEvent } from '@/lib/stripe.ts';

export const handler = define.handlers({
  POST: async (ctx) => {
    const event = await GetStripeWebhookEvent(ctx);

    const { customer } = event.data.object;

    console.log('Received hook: ' + event.type);

    const user = await getUserByStripeCustomer(customer);
    if (!user) throw new HttpError(STATUS_CODE.NotFound, 'User not found');

    switch (event.type) {
      case 'customer.subscription.created': {
        await setUserData({ ...user, isSubscribed: true });
        return new Response(null, { status: STATUS_CODE.Created });
      }
      case 'customer.subscription.deleted': {
        await setUserData({ ...user, isSubscribed: false });
        return new Response(null, { status: STATUS_CODE.Accepted });
      }
      default: {
        throw new HttpError(STATUS_CODE.BadRequest, 'Event type not supported');
      }
    }
  },
});
