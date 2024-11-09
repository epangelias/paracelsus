import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user.ts';
import { UserForm } from '@/components/UserForm.tsx';

export const handler = define.handlers({
    POST: async (ctx) => {
        if (!ctx.state.user) throw new HttpError(404);
        try {
            const formData = await ctx.req.formData();
            ctx.state.user.name = formData.get('name') as string;
            ctx.state.user.username = formData.get('username') as string;
            await updateUser(ctx.state.user);
            return page();
        } catch (e) {
            return page({ error: e.message });
        }
    },
    GET: async (ctx) => {
        if (!ctx.state.user) throw new HttpError(404);
        return page();
    },
});

export default define.page<typeof handler>(({ state, data }) => (
    <main>
        <h1>User {state.user!.name}</h1>

        <p>
            <a href='/'>Back</a>
            <a href='/user/signout'>Signout</a>
            {state.user!.isSubscribed
                ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
                : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
        </p>

        {!state.user!.isEmailVerified && (
            <p>
                Please verify your email address. <a href='/user/resend-email'>Resend email</a>
            </p>
        )}

        <UserForm user={state.user} error={data?.error} />
    </main>
));
