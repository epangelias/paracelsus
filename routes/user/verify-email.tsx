import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { getUserByVerificationCode, updateUser } from '@/lib/user.ts';

export const handler = define.handlers({
    GET: async (ctx) => {
        try {
            const code = ctx.url.searchParams.get('code') as string;
            if (!code) throw new HttpError(400, 'Missing verification code');
            const user = await getUserByVerificationCode(code);
            if (!user) {
                throw new Error(
                    'Verification code expired. Request a new one in the user settings',
                );
            }
            await updateUser({ ...user, isEmailVerified: true });
            return page({ message: 'Email verified!' });
        } catch (e) {
            return page({ message: e.message });
        }
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <h1>{data.message}</h1>
        <p>
            <a href='/'>Go to homepage</a>
        </p>
    </main>
));
