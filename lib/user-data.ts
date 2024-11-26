/* AI G
**Refactoring Suggestions:**

* Consider breaking down the `createUser` function into smaller, more focused functions, such as `generateStripeCustomerId` and `saveUserToDatabase`.
* Consider extracting the validation logic into separate functions, such as `validateEmail` and `validateName`.
* Consider using a more efficient data structure, such as a cache, to store the user data instead of retrieving it from the database on every request.
*/


import { FreshContext } from 'fresh';
import { getCookies, setCookie } from 'jsr:@std/http/cookie';
import { db } from '@/lib/utils.ts';
import { State, UserData } from '@/lib/types.ts';
import { Meth } from '@/lib/meth.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { hashText } from '@/lib/crypto.ts';

// DB

export async function loadUserToContext(ctx: FreshContext<State>) {
  if (ctx.state.user) return ctx.state.user;
  const { auth } = getCookies(ctx.req.headers);
  ctx.state.auth = auth;
  const user = await getUserByAuth(auth);
  if (user) ctx.state.user = user;
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

export async function getUserById(id: string) {
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

async function createAuthCode(id: string) {
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
  const passwordHash = await hashText(`${user.salt}:${password}`);
  if (user.passwordHash != passwordHash) return null;
  return await createAuthCode(id);
}

export async function generateEmailVerification(user: UserData) {
  const code = Meth.code(12);
  await db.set(['userVerification', code], { id: user.id, email: user.email }, {
    expireIn: 1000 * 60 * 60, // One hour
  });
  return code;
}

async function generateStripeCustomerId(name: string, email: string) {
  if (!isStripeEnabled()) return;
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

export async function getUserByVerificationCode(code: string) {
  const res = await db.get<{ id: string; email: string }>(['userVerification', code]);
  if (res.versionstamp == null) return null;
  const user = await getUserById(res.value.id);
  if (user?.email != res.value.email) return null;
  return user;
}

// User Data

export async function createUser(name: string, email: string, password: string) {
  if (password.length < 6) throw new Error('Password must be at least 8 characters');
  if (password.length > 100) throw new Error('Password must be less than 100 characters');

  const salt = Meth.code();
  const passwordHash = await hashText(`${salt}:${password}`);

  const user: UserData = {
    id: Meth.code(),
    created: Date.now(),
    email,
    passwordHash,
    salt,
    name,
    isSubscribed: false,
    tokens: 5,
    isEmailVerified: false,
    hasVerifiedEmail: false,
    pushSubscriptions: [],
  };

  return setUserData(user, { isNew: true });
}

export async function setUserData(user: UserData, { isNew } = { isNew: false }) {
  const atomic = db.atomic();
  let errorMessage = 'Error updating user';

  user = { ...user };
  user.email = normalizeEmail(user.email);
  user.name = normalizeName(user.name);

  validateUserData(user);

  if (isNew) {
    // If new user, check that doesn't already exist
    atomic.check({ key: ['users', user.id], versionstamp: null })
      .check({ key: ['usersByEmail', user.email], versionstamp: null })
      .set(['usersByEmail', user.email], { id: user.id })

    errorMessage = 'User already exists';
  } else {
    const old = await db.get<UserData>(["users", user.id]);

    if (old.versionstamp == null) throw new Error("User does not exist");

    // Ensure user data hasn't changed
    atomic.check({ key: ['users', user.id], versionstamp: old.versionstamp })
    errorMessage = 'User data changed';

    // Change email
    if (old.value.email != user.email) {
      user.isEmailVerified = false;

      atomic.check({ key: ['usersByEmail', user.email], versionstamp: null })
        .delete(['usersByEmail', old.value.email])
        .set(['usersByEmail', user.email], { id: user.id })

      errorMessage = 'User with email already exists';
    }

    if (isStripeEnabled() && old.value.stripeCustomerId) {
      // If user data changed, update stripe account
      if (user.email != old.value.email || user.name != old.value.name) {
        await stripe.customers.update(old.value.stripeCustomerId, { email: user.email, name: user.name });
      }
    }
  }

  atomic.set(['users', user.id], user);

  if (!user.stripeCustomerId && isStripeEnabled()) {
    user.stripeCustomerId = await generateStripeCustomerId(user.name, user.email)
    if (!user.stripeCustomerId) throw new Error("Failed to create stripe customer");
    atomic.set(['usersByStripeCustomer', user.stripeCustomerId], { id: user.id });
  }

  const { ok } = await atomic.commit();
  if (!ok) throw new Error(errorMessage);

  return user;
}

export async function deleteUser(id: string | null) {
  if (!id) return;
  const user = await getUserById(id);
  if (!user) return;

  const atomic = db.atomic()
    .delete(['users', id])
    .delete(['usersByEmail', user.email])
    .delete(['chat', id]);

  if (user.stripeCustomerId) {
    atomic.delete(['usersByStripeCustomer', user.stripeCustomerId]);
  }

  await atomic.commit();
}

// Validation

function validateUserData(user: UserData) {
  // Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(user.email)) throw new Error('Invalid email');
  if (user.email.length > 320) throw new Error('Email must be less than 320 characters');
  if (user.email.length < 5) throw new Error('Email must be at least 5 characters');

  // Name
  if (user.name.length < 3) throw new Error('Name must be at least 3 characters');
  if (user.name.length > 100) throw new Error('Name must be less than 100 characters');
  if (!/^[a-zA-Z\s]+$/.test(user.name)) {
    throw new Error('Name must only contain letters and spaces');
  }
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').split(' ').map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// Strip user data for sending to client

export function stripUserData(user?: UserData) {
  if (!user) return undefined;
  return {
    name: user.name,
    tokens: user.tokens,
    isSubscribed: user.isSubscribed,
    isEmailVerified: user.isEmailVerified,
    email: user.email,
    hasVerifiedEmail: user.hasVerifiedEmail,
  } as Partial<UserData>;
}

export function setAuthCookie(ctx: FreshContext, authCode: string) {
  const res = ctx.redirect('/');
  setCookie(res.headers, {
    name: 'auth',
    value: authCode,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: ctx.req.url.startsWith('https://'),
  });
  return res;
}