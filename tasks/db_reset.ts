#!/usr/bin/env -S deno run -A

import { db } from '@/lib/utils.ts';

export async function clearDb() {
  const itemsReset: Record<string, number> = {};

  const promises = [];

  for await (const res of db.list({ prefix: [] })) {
    const key = res.key.slice(0, -1).join('/');
    itemsReset[key] = itemsReset.hasOwnProperty(key) ? itemsReset[key] + 1 : 1;
    promises.push(db.delete(res.key));
  }

  console.log(itemsReset);
  await Promise.all(promises);
}

if (import.meta.main) await clearDb();
