#!/usr/bin/env -S deno run -A --env --watch=static/,routes/,css/

/* AI GENERATED COMMENT
Here's my feedback on the provided code:

The shebang line is not necessary in a TypeScript file.
Importing 'fresh/dev' and '@/main.ts' could be refactored to use relative imports for better maintainability.
Deno.args.includes('build') could be replaced with a more explicit and typed way of handling command-line arguments.
The code is simple and easy to read, but it could be improved with more descriptive variable names and function names.
There are no obvious security or performance issues in this code snippet.
*/



import { Builder } from 'fresh/dev';
import { app } from '@/main.ts';

const builder = new Builder();

if (Deno.args.includes('build')) await builder.build(app);
else await builder.listen(app);
