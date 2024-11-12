

import { FreshContext, HttpError } from 'fresh';
import { getCookies } from "jsr:@std/http/cookie";
import { State } from '@/lib/utils.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { Meth } from '@/lib/meth.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { STATUS_CODE } from '@std/http/status';

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
    const res = await db.get<{ id: string }>(["usersByAuth", auth]);
    if (res.versionstamp == null) return null;
    return res.value?.id;
}

async function getUserById(id: string) {
    const res = await db.get<User>(["users", id]);
    if (res.versionstamp == null) return null;
    return res.value;
}

export async function getUserIdByUsername(id: string) {
    const res = await db.get<{ id: string }>(["usersByUsername", id]);
    if (res.versionstamp == null) return null;
    return res.value?.id;
}

async function getUserIdByStripeCustomer(stripeCustomerId: string) {
    const res = await db.get<{ id: string }>(["usersByStripeCustomer", stripeCustomerId]);
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
    await db.set(["usersByAuth", code], { id }, { expireIn: 1000 * 60 * 60 * 24 * 30 });
    return code;
}

export async function authorizeUser(username: string, password: string) {
    username = transformUsername(username);

    const id = await getUserIdByUsername(username);
    if (!id) return null;
    const user = await getUserById(id);
    if (!user) return null;
    const passwordHash = await Meth.hash(`${user.salt}:${password}`);
    if (user.passwordHash != passwordHash) return null;
    return await CreateAuthCode(id);
}


export async function createUser(name: string, username: string, password: string) {
    username = transformUsername(username);

    validatePassword(password);
    validateUsername(username);
    validateName(name);

    const salt = Meth.code();
    const passwordHash = await Meth.hash(`${salt}:${password}`);

    let stripeCustomerId;

    if (isStripeEnabled()) {
        const customer = await stripe.customers.create({
            email: username,
            name: name,
        });
        stripeCustomerId = customer.id;
    }

    const user: User = {
        id: Meth.code(),
        username,
        passwordHash,
        salt,
        name,
        stripeCustomerId,
        isSubscribed: false,
        tokens: 5,
        isEmailVerified: false,
        hasVerifiedEmail: false,
    }

    const res = await db.atomic()
        .check({ key: ["users", user.id], versionstamp: null })
        .check({ key: ["usersByUsername", user.username], versionstamp: null })
        .set(["users", user.id], user)
        .set(["usersByUsername", user.username], { id: user.id })
        .set(["usersByStripeCustomer", user.stripeCustomerId || ""], { id: user.id })
        .commit();

    if (!res.ok) throw new Error("User already exists");

    return user;
}

export async function generateEmailVerification(user: User) {
    const code = Meth.code(12);
    await db.set(["userVerification", code], { id: user.id, email: user.username }, { expireIn: 1000 * 60 * 60 })
    return code;
}

export async function deleteUser(id: string | null) {
    if (!id) return;
    const user = await getUserById(id);
    if (!user) return;
    await db.delete(["users", id]);
    await db.delete(["usersByUsername", user.username]);

    // User data
    await db.delete(["chat", id]);

    if (user.stripeCustomerId)
        await db.delete(["usersByStripeCustomer", user.stripeCustomerId]);

    const promises = []
    const codes = db.list<{ id: string }>({ prefix: ["usersByAuth"] });
    for await (const res of codes) if (res.value.id == id) promises.push(db.delete(res.key));
    await Promise.all(promises);
}

function validatePassword(password: string) {
    if (password.length < 6) throw new Error("Password must be at least 8 characters");
    if (password.length > 100) throw new Error("Password must be less than 100 characters");
}

function validateEmail(email: string) {
    const regex = /^[^@]+@[^@]+\.[^@]+$/;
    return !!email.match(regex);
}

function validateUsername(username: string) {
    if (username.length < 3) throw new Error("Username must be at least 3 characters");
    if (username.length > 100) throw new Error("Username must be less than 100 characters");
    if (!validateEmail(username)) throw new Error("Invalid email");
    // if (!/^[a-zA-Z0-9_-]+$/.test(username)) throw new Error("Username must be alphanumeric");
}

function transformUsername(username: string) {
    return username.toLowerCase();
}

function validateName(name: string) {
    if (name.length < 3) throw new Error("Name must be at least 3 characters");
    if (name.length > 100) throw new Error("Name must be less than 100 characters");
    if (!/^[a-zA-Z\s]+$/.test(name)) throw new Error("Name must only contain letters and spaces");
}

export async function updateUser(changes: User) {
    const user = await getUserById(changes.id);
    if (!user) throw new Error("User not found");

    validateUsername(changes.username);
    validateName(changes.name);

    if (user.username != changes.username) {
        const { ok } = await db.atomic()
            .check({ key: ["usersByUsername", changes.username], versionstamp: null })
            .delete(["usersByUsername", user.username])
            .set(["usersByUsername", changes.username], { id: user.id })
            .commit();
        if (!ok) throw new Error("Username already exists");
        changes.isEmailVerified = false;
    }

    if (isStripeEnabled() && user.stripeCustomerId) {
        stripe.customers.update(user.stripeCustomerId, { email: changes.username, name: changes.name });
    }

    await db.set(["users", changes.id], changes);
}

export async function getUserByVerificationCode(code: string) {
    const res = await db.get<{ id: string, email: string }>(["userVerification", code]);
    if (res.versionstamp == null) return null;
    const user = await getUserById(res.value.id);
    if (user?.username != res.value.email) return null;
    return user;
}
