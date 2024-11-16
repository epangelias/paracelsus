import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { authorizeUser, createUser } from '@/lib/user.ts';
import { SignupForm } from '@/components/SiginupForm.tsx';
import { sendEmailVerification } from '@/lib/mail.ts';
import { SetAuthCookie } from '@/routes/user/signin.tsx';

export const handler = define.handlers({
  POST: async (ctx) => {
    const formData = await ctx.req.formData();

    const Name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const user = await createUser(Name, username, password);
      sendEmailVerification(ctx.url.origin, user);

      const authCode = await authorizeUser(username, password);
      if (authCode) return SetAuthCookie(ctx, authCode);

      throw new Error('Error authorizing user');
    } catch (e) {
      return page({ error: e.message, Name, username });
    }
  },
});

export default define.page<typeof handler>(({ data }) => (
  <main>
    <div>
      <h1>Sign Up</h1>
      <SignupForm error={data?.error} username={data?.username} name={data?.Name} />
    </div>
  </main>
));
