#!/usr/bin/env -S deno run -A

/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Security issues: 
None found.

Performance issues: 
The function `clearDb` is doing multiple operations concurrently using `Promise.all`, 
which can lead to performance issues if the number of promises is high.

Code style issues: 
The code style is consistent and follows best practices.

Best practices: 
The use of `import.meta.main` to ensure the script is run as the main entry point is a good practice.

Maintainability issues: 
The function `clearDb` is doing two separate operations: 
counting items and deleting items, which can be separated into two functions for better maintainability.

Readability issues: 
The variable name `itemsReset` can be more descriptive, 
such as `itemCounts` or `deletedItemCounts`.

Refactoring: 
The `for await` loop can be replaced with `Array.prototype.forEach` for better readability.

No other issues found.
*/



import { db } from '@/lib/utils.ts';

export async function clearDb() {
  const itemsReset: Record<string, number> = {};

  const promises = [];

  for await (const res of db.list({ prefix: [] })) {
    const key = res.key.slice(0, -1).join('/');
    itemsReset[key] = (key in itemsReset) ? itemsReset[key] + 1 : 1;
    promises.push(db.delete(res.key));
  }

  console.log(itemsReset);
  await Promise.all(promises);
}

if (import.meta.main) await clearDb();
