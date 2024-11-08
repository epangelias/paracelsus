import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { getUserFromState } from '@/lib/user.ts';
import { updateUser } from '@/lib/user.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        const user = await getUserFromState(ctx);
        if (!user) throw new HttpError(404);
        const formData = await ctx.req.formData();
        user.name = formData.get('name') as string;
        await updateUser(user);
        return page({ user });
    },
    GET: async (ctx) => {
        const user = await getUserFromState(ctx);
        if (!user) throw new HttpError(404);
        return page({ user });
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <h1>User {data.user.name}</h1>
        <form method='POST'>
            <div>
                <label for='name'>Name</label> <br />
                <input type='text' name='name' id='name' value={data.user.name} required />
            </div>
            <button>Save</button>
        </form>
        {!data.user.isEmailVerified && (
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
            {data.user.isSubscribed
                ? <a href='/user/subscription'>Manage Subscription</a>
                : <a href='/user/subscribe'>Subscribe</a>}
        </p>
    </main>
));
