import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { setCookie } from 'jsr:@std/http/cookie';
import { authorizeUser, createUser } from '../../lib/user.ts';
import { SignupForm } from '@/components/SiginupForm.tsx';

export const handler = define.handlers({
    POST: async (ctx) => {
        try {
            const formData = await ctx.req.formData();

            const name = formData.get('name') as string;
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            await createUser(name, username, password);

            return ctx.redirect('/user/signin');
        } catch (e) {
            return page({ error: e.message });
        }
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <div>
            <p>
                <a href='/'>Back</a>
            </p>
            <h1>Sign Up</h1>
            {data?.error && <p>{data.error}</p>}
            <SignupForm />
            <a href='/user/signin'>Sign in</a>
        </div>
    </main>
));
