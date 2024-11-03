

import { FreshContext } from 'fresh';
import { getCookies } from "jsr:@std/http/cookie";
import { State } from '@/lib/utils.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { Meth } from '@/lib/meth.ts';

db.set(["users", "1"], { id: "1", username: "a", password: "a" });
db.set(["usersByUsername", "a"], { id: "1" });

export async function getUserFromContext(ctx: FreshContext<State>) {
    if (ctx.state.user) return ctx.state.user;
    const { auth } = getCookies(ctx.req.headers);
    return await getUserByAuth(auth);
}

export async function getUserByAuth(auth: string) {
    if (!auth) return;
    const id = await getUserIdByAuth(auth);
    if (!id) return null;
    return await getUserById(id);
}


async function getUserIdByAuth(auth: string) {
    const res = await db.get<{ id: string }>(["usersByAuth", auth]);
    if (res.versionstamp == null) return null;
    return res.value?.id;
}

async function getUserById(id: string) {
    const res = await db.get<User>(["users", id]);
    if (res.versionstamp == null) return null;
    return res.value;
}

async function getUserIdByUsername(id: string) {
    const res = await db.get<{ id: string }>(["usersByUsername", id]);
    if (res.versionstamp == null) return null;
    return res.value?.id;
}

async function CreateAuthCode(id: string) {
    const code = Meth.code();
    await db.set(["usersByAuth", code], { id }, { expireIn: 1000 * 60 * 60 * 24 * 30 });
    return code;
}

export async function authorizeUser(username: string, password: string) {
    const id = await getUserIdByUsername(username);
    if (!id) return null;
    const user = await getUserById(id);
    if (!user) return null;
    if (user.password != password) return null;
    return await CreateAuthCode(id);
}