import { define } from '@/lib/utils/utils.ts';
import { HttpError, page } from 'fresh';
import { authorizeUser, setAuthCookie } from '@/lib/user/user-data.ts';

import { Page } from '@/components/Page.tsx';
import { RateLimiter } from '@/lib/utils/rate-limiter.ts';
import { sendEmailVerification } from '@/app/email.tsx';
import { createUser } from '@/app/user.ts';
import { Field } from '@/components/Field.tsx';
import { Form } from '@/islands/Form.tsx';
import { FormButton } from '@/components/FormButton.tsx';
import { formDataToObject, getErrorMessage } from '@/lib/utils/meth.ts';

const HAS_SIGN_UP_CODE = Deno.env.has('SIGN_UP_CODE');
const SIGN_UP_CODE = Deno.env.get('SIGN_UP_CODE');
const SIGN_UP_ONLY = Deno.env.get('SIGN_UP_ONLY') == 'true';

const limiter = new RateLimiter();

export const handler = define.handlers({
  GET: (ctx) => {
    ctx.state.title = 'Sign Up';
    return page();
  },
  POST: async (ctx) => {
    limiter.request();

    const { name, email, password, signupCode } = formDataToObject(await ctx.req.formData());

    try {
      const correctCode = HAS_SIGN_UP_CODE && signupCode && signupCode == SIGN_UP_CODE;
      if ((signupCode || SIGN_UP_ONLY) && !correctCode) throw new Error('Invalid sign up code');

      const user = await createUser({ name, email, password, isPremium: !!correctCode });

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
      throw new HttpError(400, getErrorMessage(e));
    }
  },
});

export default define.page<typeof handler>(() => (
  <Page hideHeader hideBanner>
    <div>
      <h1>Sign Up</h1>
      <Form method='POST'>
        <Field name='name' label='Name' required autofocus />
        <Field name='email' label='Email' type='email' required />
        <Field name='password' label='Password' type='password' required />

        {HAS_SIGN_UP_CODE && (
          <details>
            <summary>Do you have a sign up code?</summary>
            <Field name='signupCode' type='text' label='Sign Up Code' />
          </details>
        )}

        <FormButton class='wide'>Sign Up</FormButton>
        <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>
          Already have an account? <a href='/user/signin'>Sign In</a>
        </p>
      </Form>
    </div>
  </Page>
));
