import { define } from '@/lib/utils.ts';
import { FreshContext, page } from 'fresh';
import { setCookie } from 'jsr:@std/http/cookie';
import { SigninForm } from '@/components/SigininForm.tsx';
import { authorizeUser } from '@/lib/user.ts';

export const handler = define.handlers({
  POST: async (ctx) => {
    const formData = await ctx.req.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const authCode = await authorizeUser(email, password);
    if (authCode) return SetAuthCookie(ctx, authCode);

    return page({ error: 'Invalid credentials', email });
  },
});

export default define.page<typeof handler>(({ data }) => (
  <main>
    <div>
      <h1>Sign In</h1>
      <SigninForm error={data?.error} email={data?.email} />
    </div>
  </main>
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
