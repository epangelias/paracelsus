import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { setCookie } from 'jsr:@std/http/cookie';
import { authorizeUser } from '../../lib/user.ts';
import { SigninForm } from '@/components/SigininForm.tsx';

export const handler = define.handlers({
    POST: async (ctx) => {
        const formData = await ctx.req.formData();

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const authCode = await authorizeUser(username, password);

        if (authCode) {
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

        return page({ error: 'Invalid credentials' });
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <div>
            <h1>Sign In</h1>
            {data?.error && <p>{data.error}</p>}
            <SigninForm />
            <a href='/user/signup'>Sign up</a>
        </div>
    </main>
));
