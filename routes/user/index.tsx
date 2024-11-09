import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        if (!ctx.state.user) throw new HttpError(404);
        const formData = await ctx.req.formData();
        ctx.state.user.name = formData.get('name') as string;
        await updateUser(ctx.state.user);
        return page();
    },
    GET: async (ctx) => {
        if (!ctx.state.user) throw new HttpError(404);
        return page();
    },
});

export default define.page<typeof handler>(({ state }) => (
    <main>
        <h1>User {state.user!.name}</h1>
        <form method='POST'>
            <div>
                <label for='name'>Name</label> <br />
                <input type='text' name='name' id='name' value={state.user!.name} required />
            </div>
            <button>Save</button>
        </form>
        {!state.user!.isEmailVerified && (
            <p>
                Please verify your email address. <a href='/user/resend-email'>Resend email</a>
            </p>
        )}
        <p>
            <a href='/'>Back</a>
        </p>
        <p>
            <a href='/user/signout'>Signout</a>
        </p>
        <p>
            {state.user!.isSubscribed
                ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
                : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
        </p>
    </main>
));
