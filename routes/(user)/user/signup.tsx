import { define } from '@/lib/utils/utils.ts';
import { page } from 'fresh';
import { authorizeUser, setAuthCookie } from '../../../lib/user/user-data.ts';
import { Meth } from '@/lib/utils/meth.ts';
import { Page } from '@/components/Page.tsx';
import { RateLimiter } from '../../../lib/utils/rate-limiter.ts';
import { sendEmailVerification } from '@/app/email.ts';
import { createUser } from '@/app/user.ts';
import { Field } from '../../../components/Field.tsx';

const limiter = new RateLimiter();

export const handler = define.handlers({
  POST: async (ctx) => {
    limiter.request();

    const { name, email, password } = Meth.formDataToObject(await ctx.req.formData());

    try {
      const user = await createUser(name, email, password);

      try {
        await sendEmailVerification(ctx.url.origin, user);
      } catch (e) {
        // Do nothing if rate limited
        console.error('Error sending verification email: ', e);
      }

      const authCode = await authorizeUser(email, password);
      if (authCode) return setAuthCookie(ctx, authCode);

      throw new Error('Error authorizing user');
    } catch (e) {
      return page({ error: Meth.getErrorMessage(e), name, email });
    }
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <div>
      <h1>Sign Up</h1>
      <form method='POST'>
        <Field name='name' label='Name' required autofocus value={data?.name} />
        <Field name='email' label='Email' type='email' required value={data?.email} />
        <Field name='password' label='Password' type='password' required />

        {data?.error && <p class='error-message' role='alert' aria-live='assertive'>{data?.error}</p>}

        <div>
          <button>Sign Up</button>
          <a href='/user/signin'>Sign In</a>
        </div>
      </form>
    </div>
  </Page>
));
