/* AI GENERATED COMMENT
Here is my feedback:

Top-level await is discouraged, it can lead to unexpected behavior and limitations.
Consider wrapping the `Deno.openKv()` call in an async function or a promise.
The `db` export is not cached, it will recreate the KV store on every import.
Consider using a singleton pattern or a caching mechanism to improve performance.
No error handling is present, consider adding try-catch blocks for potential errors.
The file lacks a clear purpose or description, consider adding a comment or docstring.
The import from `@/lib/types.ts` uses a relative path, consider using an absolute path or a path alias.
*/


import { createDefine } from 'fresh';
import { State } from '@/lib/types.ts';

export const define = createDefine<State>();
export const db = await Deno.openKv();
