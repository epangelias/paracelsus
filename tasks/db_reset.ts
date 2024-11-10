#!/usr/bin/env -S deno run -A

import { db } from '@/lib/db.ts';
import { createUser, deleteUser, getUserIdByUsername } from '@/lib/user.ts';

if (!confirm("WARNING: The database will be reset. Continue?")) Deno.exit();


const iter = db.list({ prefix: [] });
const promises = [];
for await (const res of iter) promises.push(db.delete(res.key));
await Promise.all(promises);

await deleteUser(await getUserIdByUsername("a@a.a"));
await createUser("Albert", "a@a.a", "134391");

db.close();
