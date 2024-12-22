import { define } from '@/lib/utils/utils.ts';
import { page } from 'fresh';
import { authorizeUser, setAuthCookie } from '../../../lib/user/user-data.ts';
import { Meth } from '@/lib/utils/meth.ts';
import { Page } from '@/components/Page.tsx';
import { RateLimiter } from '../../../lib/utils/rate-limiter.ts';
import { isMailEnabled } from '../../../lib/mail/mail.ts';
import { Field } from '../../../components/Field.tsx';

const limiter = new RateLimiter();

export const handler = define.handlers({
  POST: async (ctx) => {
    limiter.request();

    const { email, password } = Meth.formDataToObject(await ctx.req.formData());

    const authCode = await authorizeUser(email, password);
    if (authCode) return setAuthCookie(ctx, authCode);

    return page({ error: 'Invalid credentials', email });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <div>
      <h1>Sign In</h1>
      <form method='POST'>
        <Field name='email' type='email' label='Email' value={data?.email} required autofocus />
        <Field name='password' type='password' label='Password' required />

        {data?.error && <p class='error-message' role='alert' aria-live='assertive'>{data?.error}</p>}

        <div>
          <button>Sign In</button>
          <a href='/user/signup'>Sign Up</a>
        </div>
      </form>

      {isMailEnabled() && (
        <p style={{ fontSize: '0.8em', textAlign: 'center' }}>
          <a href='/user/lost-password'>Lost your password?</a>
        </p>
      )}
    </div>
  </Page>
));
