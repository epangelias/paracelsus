/* AI GENERATED COMMENT
Here is my feedback on the provided code:

**Security Issues:**

* The `Meth.hash` function is used to hash passwords, but it's not clear what hashing algorithm is being used. It's recommended to use a password hashing algorithm like bcrypt, scrypt, or Argon2.
* The `CreateAuthCode` function generates a code that can be used to authenticate a user, but it's not clear how this code is protected from unauthorized access. It's recommended to use a secure token generation algorithm and to store the tokens securely.

**Performance Issues:**

* The `db.list` function is used to retrieve a list of codes, but it's not clear how this function performs when dealing with a large number of codes. It's recommended to consider using a more efficient data structure or query mechanism.
* The `db.atomic` function is used to perform multiple operations atomically, but it's not clear how this function performs when dealing with a large number of operations. It's recommended to consider using a more efficient transaction mechanism.

**Code Style Issues:**

* The code uses inconsistent indentation and whitespace. It's recommended to use a consistent code style throughout the file.
* Some function names, such as `CreateAuthCode`, are not following the conventional camelCase naming style. It's recommended to use a consistent naming convention throughout the file.

**Best Practices:**

* The code is not following the single responsibility principle, as some functions are performing multiple, unrelated tasks. It's recommended to break down these functions into smaller, more focused functions.
* The code is not using error handling mechanisms consistently. It's recommended to use a consistent error handling mechanism throughout the file.
* The code is not following the Don't Repeat Yourself (DRY) principle, as some logic is duplicated in multiple functions. It's recommended to extract this logic into separate functions.

**Maintainability Issues:**

* The code is not modular, as all functions are exported from a single file. It's recommended to break down the code into smaller, more focused modules.
* The code is not following a consistent naming convention, which makes it harder to understand and maintain. It's recommended to use a consistent naming convention throughout the file.

**Readability Issues:**

* Some function names, such as `GetUserFromState`, are not descriptive. It's recommended to use more descriptive function names.
* Some variable names, such as `res`, are not descriptive. It's recommended to use more descriptive variable names.
* The code has a large number of comments, but some comments are not clear or concise. It's recommended to use clear and concise comments throughout the file.

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

// DB

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

export async function generateEmailVerification(user: UserData) {
  const code = Meth.code(12);
  await db.set(['userVerification', code], { id: user.id, email: user.email }, {
    expireIn: 1000 * 60 * 60, // One hour
  });
  return code;
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
    created: Date.now(),
    email,
    passwordHash,
    salt,
    name,
    stripeCustomerId,
    isSubscribed: false,
    tokens: 5,
    isEmailVerified: false,
    hasVerifiedEmail: false,
    pushSubscriptions: [],
  };

  validateUserData(user);

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

export async function deleteUser(id: string | null) {
  if (!id) return;
  const user = await getUserById(id);
  if (!user) return;
  await db.delete(['users', id]);
  await db.delete(['usersByEmail', user.email]);

  // Delete user related data
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
  changes = { ...changes };

  const user = await getUserById(changes.id);
  if (!user) throw new Error('User not found');

  changes.email = normalizeEmail(changes.email);
  changes.name = normalizeName(changes.name);

  validateUserData(changes);

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

  return changes;
}

export async function getUserByVerificationCode(code: string) {
  const res = await db.get<{ id: string; email: string }>(['userVerification', code]);
  if (res.versionstamp == null) return null;
  const user = await getUserById(res.value.id);
  if (user?.email != res.value.email) return null;
  return user;
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