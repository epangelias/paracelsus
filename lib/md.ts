/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Importing from a CDNs directly is not recommended, consider using a package manager like deno.land/x/npm or yarn to install dependencies.

The ammoniaInit variable is awaiting the initialization of ammonia, but it's not being used anywhere else in the code, consider removing it.

The marked function is not being awaited, consider adding await before marked(input) to ensure it's properly handled.

The function safelyRenderMarkdown is doing two separate operations, consider splitting it into two separate functions for better readability and maintainability.

No validation is being done on the input string, consider adding input sanitization to prevent potential security issues.

Consider adding type annotations for the input parameters and return types of the function for better code readability.

The function name safelyRenderMarkdown implies that it's doing some kind of safety checks, but it's not clear what kind of checks, consider adding a comment to explain what kind of safety checks it's doing.
*/


import * as ammonia from 'https://deno.land/x/ammonia@0.3.1/mod.ts';
import { marked } from 'marked';

const ammoniaInit = ammonia.init();

export async function safelyRenderMarkdown(input: string): Promise<string> {
  await ammoniaInit;
  return ammonia.clean(await marked(input));
}
