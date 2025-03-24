import { db } from '../utils.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe/stripe.ts';

export interface UserData {
  id: string;
  created: number;
  email?: string | null;
  name: string;
  stripeCustomerId?: string;
  isSubscribed: boolean;
  hasSubscribed: boolean;
  tokens: number;
  pushSubscriptions: PushSubscription[];
}

export async function getUserByAuth(auth: string) {
  if (!auth) return null;
  const res = await db.get<{ id: string }>(['usersByAuth', auth]);
  if (res.versionstamp == null) return null;
  return await getUserById(res.value.id);
}

export async function setUserAuth(auth: string, id: string) {
  return await db.set(['usersByAuth', auth], { id })
}

export async function getUserById(id: string) {
  return (await db.get<UserData>(['users', id])).value;
}

export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const res = await db.get<{ id: string }>(['usersByStripeCustomer', stripeCustomerId]);
  return res.value && await getUserById(res.value.id);
}

async function generateStripeCustomerId(name: string, email: string) {
  if (!isStripeEnabled()) return;
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

export async function setUserData(userId: string, modifyUser: (user: UserData) => unknown) {
  const atomic = db.atomic();
  let errorMessage = 'Error updating user';

  const old = await db.get<UserData>(['users', userId]);

  if (old.versionstamp == null) throw new Error('User does not exist');

  const user = { ...old.value };
  await modifyUser(user);

  // Ensure user data hasn't changed during atomic operation
  atomic.check({ key: ['users', user.id], versionstamp: old.versionstamp });
  errorMessage = 'User data changed';

  if (isStripeEnabled() && !user.stripeCustomerId) {
    user.stripeCustomerId = await generateStripeCustomerId(user.name, user.email);
    if (!user.stripeCustomerId) throw new Error('Failed to create stripe customer');
    atomic.set(['usersByStripeCustomer', user.stripeCustomerId], { id: user.id });
  }

  atomic.set(['users', user.id], user);

  const { ok } = await atomic.commit();
  if (!ok) throw new Error(errorMessage);

  return user;
}

export async function createUserData(user: UserData) {
  const atomic = db.atomic();

  // If new user, check that doesn't already exist
  atomic.check({ key: ['users', user.id], versionstamp: null });

  // Create Stripe customer
  if (!user.stripeCustomerId && isStripeEnabled()) {
    user.stripeCustomerId = await generateStripeCustomerId(user.name, user.email);
    if (!user.stripeCustomerId) throw new Error('Failed to create stripe customer');
    atomic.set(['usersByStripeCustomer', user.stripeCustomerId], { id: user.id });
  }

  atomic.set(['users', user.id], user);

  const { ok } = await atomic.commit();
  if (!ok) throw new Error('User already exists');

  return user;
}

export async function deleteUserData(id: string | null) {
  if (!id) return;
  const user = await getUserById(id);
  if (!user) return;

  const atomic = db.atomic()
    .delete(['users', id])
    .delete(['usersByStripeCustomer', user.stripeCustomerId || ''])
    .delete(['chat', id]);

  await atomic.commit();
}

export function createUser(options: { id: string, name: string; email: string; isPremium: boolean }) {
  return createUserData({
    id: options.id,
    created: Date.now(),
    name: options.name,
    email: options.email,
    tokens: 5,
    isSubscribed: options.isPremium,
    hasSubscribed: options.isPremium,
    pushSubscriptions: [],
  });
}