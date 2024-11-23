import { define } from '@/lib/utils.ts';
import { getUserByStripeCustomer, updateUser } from '../../lib/user-data.ts';
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
        await updateUser({ ...user, isSubscribed: true });
        return new Response(null, { status: STATUS_CODE.Created });
      }
      case 'customer.subscription.deleted': {
        await updateUser({ ...user, isSubscribed: false });
        return new Response(null, { status: STATUS_CODE.Accepted });
      }
      default: {
        throw new HttpError(STATUS_CODE.BadRequest, 'Event type not supported');
      }
    }
  },
});
