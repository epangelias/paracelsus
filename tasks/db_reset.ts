#!/usr/bin/env -S deno run -A

import { db } from "@/lib/utils.ts";

const itemsReset: Record<string, number> = {};

const promises = [];

for await (const res of db.list({ prefix: [] })) {
  const key = res.key.slice(0, -1).join("/");
  itemsReset[key] = itemsReset.hasOwnProperty(key) ? itemsReset[key] + 1 : 1;
  promises.push(db.delete(res.key));
}

await Promise.all(promises);

db.close();

console.log(itemsReset);
console.log("RESET DATABASE");