import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { LoginForm } from '@/components/LoginForm.tsx';
import { getCookies, setCookie } from 'jsr:@std/http/cookie';
import { authorizeUser, getUserByAuth } from '@/lib/auth.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        const formData = await ctx.req.formData();

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const authCode = await authorizeUser(username, password);

        if (authCode) {
            const res = ctx.redirect('/');
            setCookie(res.headers, { name: 'auth', value: authCode });
            return res;
        }

        return page({ error: 'Invalid credentials' });
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <div>
            <h1>Login</h1>
            {data?.error && <p>{data.error}</p>}
            <LoginForm />
        </div>
    </main>
));
