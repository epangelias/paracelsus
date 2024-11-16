import { define } from '@/lib/utils.ts';
import { sendEmailVerification } from '@/lib/mail.ts';
import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { page } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers({
  GET: (ctx) => {
    if (!ctx.state.user || ctx.state.user.isEmailVerified) {
      throw new HttpError(STATUS_CODE.Unauthorized);
    }
    sendEmailVerification(ctx.url.origin, ctx.state.user);
    return page();
  },
});

export default define.page(() => (
  <main>
    <h1>Sent verification link to your email!</h1>
    <p>
      <a href='/'>Go to homepage</a>
    </p>
  </main>
));
