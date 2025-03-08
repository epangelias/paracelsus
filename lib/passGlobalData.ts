import { State } from '@/app/types.ts';
import { stripUserData } from '@/app/user.ts';
import { isMailEnabled } from '@/lib/mail/mail.ts';
import { isPushEnabled } from '@/lib/pwa/push.ts';
import { isStripeEnabled } from '@/lib/stripe/stripe.ts';

export function passGlobalData(state: State) {
  return {
    user: stripUserData(state.user),
    mailEnabled: isMailEnabled(),
    stripeEnabled: isStripeEnabled(),
    pushEnabled: isPushEnabled()
  };
}