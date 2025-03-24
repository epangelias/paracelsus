import { State, UserData } from '@/app/types.ts';
import { isMailEnabled } from './mail.ts';
import { isPushEnabled } from '@/lib/pwa/push.ts';
import { isStripeEnabled } from '@/lib/stripe/stripe.ts';
import { isOauthEnabled } from '@/lib/oauth.ts';

export function stripUserData(user?: UserData) {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    tokens: user.tokens,
    isSubscribed: user.isSubscribed,
    hasSubscribed: user.hasSubscribed,
  } as Partial<UserData>;
}

export function passGlobalData(state: State) {
  return {
    user: stripUserData(state.user),
    mailEnabled: isMailEnabled(),
    stripeEnabled: isStripeEnabled(),
    pushEnabled: isPushEnabled(),
    authEnabled: isOauthEnabled(),
  };
}
