import { FreshContext } from 'fresh';
import { getCookies } from 'jsr:@std/http/cookie';
import { db } from './utils.ts';
import { State, UserData } from '@/lib/types.ts';
import { Meth } from '@/lib/meth.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';

export async function getUserFromState(ctx: FreshContext<State>) {
  if (ctx.state.user) return ctx.state.user;
  const { auth } = getCookies(ctx.req.headers);
  ctx.state.auth = auth;
  const user = await getUserByAuth(auth);
  if (user) ctx.state.user = user;
  return user;
}

export async function getUserByAuth(auth: string) {
  if (!auth) return;
  const id = await getUserIdByAuth(auth);
  if (!id) return null;
  return await getUserById(id);
}

async function getUserIdByAuth(auth?: string) {
  if (!auth) return;
  const res = await db.get<{ id: string }>(['usersByAuth', auth]);
  if (res.versionstamp == null) return null;
  return res.value?.id;
}

async function getUserById(id: string) {
  const res = await db.get<UserData>(['users', id]);
  if (res.versionstamp == null) return null;
  return res.value;
}

export async function getUserIdByEmail(id: string) {
  const res = await db.get<{ id: string }>(['usersByEmail', id]);
  if (res.versionstamp == null) return null;
  return res.value?.id;
}

async function getUserIdByStripeCustomer(stripeCustomerId: string) {
  const res = await db.get<{ id: string }>(['usersByStripeCustomer', stripeCustomerId]);
  if (res.versionstamp == null) return null;
  return res.value?.id;
}

export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const id = await getUserIdByStripeCustomer(stripeCustomerId);
  if (!id) return null;
  return await getUserById(id);
}

async function CreateAuthCode(id: string) {
  const code = Meth.code();
  await db.set(['usersByAuth', code], { id }, { expireIn: 1000 * 60 * 60 * 24 * 30 });
  return code;
}

export async function authorizeUser(email: string, password: string) {
  email = normalizeEmail(email);
  const id = await getUserIdByEmail(email);
  if (!id) return null;
  const user = await getUserById(id);
  if (!user) return null;
  const passwordHash = await Meth.hash(`${user.salt}:${password}`);
  if (user.passwordHash != passwordHash) return null;
  return await CreateAuthCode(id);
}

function validateUser(user: UserData) {
  // Email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(user.email)) throw new Error("Invalid email");
  if (user.email.length > 320) throw new Error("Email must be less than 320 characters");
  if (user.email.length < 5) throw new Error("Email must be at least 5 characters");

  // Name
  if (user.name.length < 3) throw new Error('Name must be at least 3 characters');
  if (user.name.length > 100) throw new Error('Name must be less than 100 characters');
  if (!/^[a-zA-Z\s]+$/.test(user.name)) throw new Error('Name must only contain letters and spaces');
}

export async function createUser(name: string, email: string, password: string) {
  email = normalizeEmail(email);
  name = normalizeName(name);

  if (password.length < 6) throw new Error('Password must be at least 8 characters');
  if (password.length > 100) throw new Error('Password must be less than 100 characters');

  const salt = Meth.code();
  const passwordHash = await Meth.hash(`${salt}:${password}`);

  let stripeCustomerId;

  if (isStripeEnabled()) {
    const customer = await stripe.customers.create({ email, name });
    stripeCustomerId = customer.id;
  }

  const user: UserData = {
    id: Meth.code(),
    email,
    passwordHash,
    salt,
    name,
    stripeCustomerId,
    isSubscribed: false,
    tokens: 5,
    isEmailVerified: false,
    hasVerifiedEmail: false,
  };

  validateUser(user);

  const res = await db.atomic()
    .check({ key: ['users', user.id], versionstamp: null })
    .check({ key: ['usersByEmail', user.email], versionstamp: null })
    .set(['users', user.id], user)
    .set(['usersByEmail', user.email], { id: user.id })
    .set(['usersByStripeCustomer', user.stripeCustomerId || ''], { id: user.id })
    .commit();

  if (!res.ok) throw new Error('User already exists');

  return user;
}

export async function generateEmailVerification(user: UserData) {
  const code = Meth.code(12);
  await db.set(['userVerification', code], { id: user.id, email: user.email }, {
    expireIn: 1000 * 60 * 60,
  });
  return code;
}

export async function deleteUser(id: string | null) {
  if (!id) return;
  const user = await getUserById(id);
  if (!user) return;
  await db.delete(['users', id]);
  await db.delete(['usersByEmail', user.email]);

  // User data
  await db.delete(['chat', id]);

  if (user.stripeCustomerId) {
    await db.delete(['usersByStripeCustomer', user.stripeCustomerId]);
  }

  const promises = [];
  const codes = db.list<{ id: string }>({ prefix: ['usersByAuth'] });
  for await (const res of codes) if (res.value.id == id) promises.push(db.delete(res.key));
  await Promise.all(promises);
}

export async function updateUser(changes: UserData) {
  const user = await getUserById(changes.id);
  if (!user) throw new Error('User not found');

  user.email = normalizeEmail(user.email);
  user.name = normalizeName(user.name);

  validateUser(changes);

  if (user.email != changes.email) {
    const { ok } = await db.atomic()
      .check({ key: ['usersByEmail', changes.email], versionstamp: null })
      .delete(['usersByEmail', user.email])
      .set(['usersByEmail', changes.email], { id: user.id })
      .commit();
    if (!ok) throw new Error('User already exists');
    changes.isEmailVerified = false;
  }

  if (isStripeEnabled() && user.stripeCustomerId) {
    stripe.customers.update(user.stripeCustomerId, { email: changes.email, name: changes.name });
  }

  await db.set(['users', changes.id], changes);
}

export async function getUserByVerificationCode(code: string) {
  const res = await db.get<{ id: string; email: string }>(['userVerification', code]);
  if (res.versionstamp == null) return null;
  const user = await getUserById(res.value.id);
  if (user?.email != res.value.email) return null;
  return user;
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}