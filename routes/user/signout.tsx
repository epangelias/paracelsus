/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code is concise and easy to read.

It's good to see that the handler is defined as a separate constant, making it reusable.

The usage of `define.handlers` is correct, and the GET handler is properly defined.

However, there is a potential security issue: the `auth` cookie is not validated or sanitized before being used to delete a user from the database.

The code assumes that the `auth` cookie will always be present, but it's better to handle the case where it's missing or invalid.

The `db.delete` method is not validated for errors, which could lead to unexpected behavior if the deletion fails.

Consider adding input validation and error handling to make the code more robust.

The code style is consistent, but it's a good practice to add more whitespace between lines to improve readability.

Overall, the code is well-structured, but it needs some security and error handling improvements.
*/


import { define } from '@/lib/utils.ts';
import { deleteCookie, getCookies } from 'jsr:@std/http/cookie';
import { db } from '@/lib/utils.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    const res = ctx.redirect('/');
    deleteCookie(res.headers, 'auth', { path: '/' });
    const { auth } = getCookies(ctx.req.headers);
    if (auth) await db.delete(['usersByAuth', auth]);
    return res;
  },
});
