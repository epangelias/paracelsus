/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Security issues:
Hardcoded timeout of 1 second in the POST handler may lead to issues with rate limiting and denial-of-service attacks.

Performance issues:
Awaiting a timeout Promise in the POST handler can cause unnecessary delay and affect the server's performance.

Code style issues:
Consistent spacing and indentation are necessary for readability; some lines have inconsistent spacing.

Best practices:
Error handling is missing for cases where formDataToObject or authorizeUser fail.
It's a good practice to handle errors explicitly to avoid unexpected behavior.

Maintainability issues:
The RateLimiter instance is created as a global variable, making it difficult to test or reuse.
Consider creating it within the handler or as a separate module.

Readability issues:
 Variable names like 'Meth' and 'SetAuthCookie' are not descriptive and could be renamed for better understanding.

Refactoring suggestion:
Consider extracting the authentication logic into a separate module or function to improve maintainability and reusability.
*/


import { define } from '@/lib/utils.ts';
import { FreshContext, page } from 'fresh';
import { setCookie } from 'jsr:@std/http/cookie';
import { SigninForm } from '@/components/SigininForm.tsx';
import { authorizeUser } from '@/lib/user-data.ts';
import { Meth } from '@/lib/meth.ts';
import { Page } from '@/components/Page.tsx';
import { RateLimiter } from '@/lib/rate-limiter.ts';

const limiter = new RateLimiter();

export const handler = define.handlers({
  POST: async (ctx) => {
    await new Promise((r) => setTimeout(r, 1000));

    limiter.request();

    const { email, password } = Meth.formDataToObject(await ctx.req.formData());

    const authCode = await authorizeUser(email, password);
    if (authCode) return SetAuthCookie(ctx, authCode);

    return page({ error: 'Invalid credentials', email });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <div>
      <h1>Sign In</h1>
      <SigninForm error={data?.error} email={data?.email} />
    </div>
  </Page>
));

export function SetAuthCookie(ctx: FreshContext, authCode: string) {
  const res = ctx.redirect('/');
  setCookie(res.headers, {
    name: 'auth',
    value: authCode,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: ctx.req.url.startsWith('https://'),
  });
  return res;
}
