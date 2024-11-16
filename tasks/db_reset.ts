#!/usr/bin/env -S deno run -A

import { db } from '@/lib/db.ts';

if (!confirm('WARNING: The database will be reset. Continue?')) Deno.exit();

const iter = db.list({ prefix: [] });
const promises = [];
for await (const res of iter) promises.push(db.delete(res.key));
await Promise.all(promises);

db.close();
