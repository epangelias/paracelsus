#!/usr/bin/env -S deno run -A

import { db } from '@/lib/db.ts';

const promises = [];

for await (const res of db.list({ prefix: [] })) {
  promises.push(db.delete(res.key));
}

await Promise.all(promises);

db.close();
