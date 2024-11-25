/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code is well-structured and easy to read.

It's good to see that error handling is implemented using HttpError.

The use of constants from '@std/http/status' is a good practice.

The code is concise and does the job, but it would be better to add some comments to explain the purpose of the handler and the page.

A potential security issue is that the authentication logic is not robust; it only checks if the user is logged in and if the email is verified.

The performance seems fine, as it's a simple GET handler and a page render.

Code style is consistent, but it would be better to follow a consistent naming convention (e.g., PascalCase for components).

It would be better to refactor the code to separate concerns; for example, the email verification logic could be in a separate function.

The code is maintainable and modular, making it easy to update or modify.
*/


import { define } from '@/lib/utils.ts';
import { sendEmailVerification } from '@/lib/mail.ts';
import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { page } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user || ctx.state.user.isEmailVerified) {
      throw new HttpError(STATUS_CODE.Unauthorized);
    }
    await sendEmailVerification(ctx.url.origin, ctx.state.user);
    return page();
  },
});

export default define.page(() => (
  <Page>
    <h1>Sent verification link to your email!</h1>
    <p>
      <a href='/'>Go to homepage</a>
    </p>
  </Page>
));
