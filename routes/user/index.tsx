import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user.ts';
import { UserUI } from '@/islands/UserUI.tsx';
import { sendEmailVerification } from '@/lib/mail.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        const user = ctx.state.user;
        if (!user) throw new HttpError(404);
        try {
            const oldUsername = user.username;
            const formData = await ctx.req.formData();
            user.name = formData.get('name') as string;
            user.username = formData.get('username') as string;
            await updateUser(user);
            if (oldUsername! + user.username) await sendEmailVerification(ctx.req.url, user);
            return page({ message: 'Saved!', error: undefined });
        } catch (e) {
            return page({ error: e.message, message: undefined });
        }
    },
    GET: (ctx) => {
        if (!ctx.state.user) throw new HttpError(404);
        return page();
    },
});

export default define.page<typeof handler>(({ state, data }) => (
    <main>
        <h1>User {state.user!.name}</h1>

        <UserUI message={data?.message} error={data?.error} />
    </main>
));
