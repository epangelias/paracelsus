import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { SigninForm } from '../../lib/components/SigininForm.tsx';
import { authorizeUser, setAuthCookie } from '@/lib/user-data.ts';
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
    if (authCode) return setAuthCookie(ctx, authCode);

    return page({ error: 'Invalid credentials', email });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <div>
      <h1>Sign In</h1>
      <SigninForm error={data?.error} email={data?.email} />
      <p style={{ fontSize: '0.8em', textAlign: 'center' }}>
        <a href='/user/lost-password'>Lost your password?</a>
      </p>
    </div>
  </Page>
));
