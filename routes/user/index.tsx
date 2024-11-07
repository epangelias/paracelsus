import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { getUserFromContext } from '@/lib/user.ts';
import { ServerCodePage } from '@/routes/_404.tsx';
import { updateUser } from '@/lib/user.ts';

export const handler = define.handlers({
    POST: async (ctx) => {
        const user = await getUserFromContext(ctx);
        if (!user) {
            return ctx.render(ServerCodePage({ codeDescription: 'Unauthorized', serverCode: 401 }));
        }
        const formData = await ctx.req.formData();
        user.name = formData.get('name') as string;
        await updateUser(user);
        return page({ username: user.username, isSubscribed: user.isSubscribed, name: user.name });
    },
    GET: async (ctx) => {
        const user = await getUserFromContext(ctx);
        if (!user) {
            return ctx.render(ServerCodePage({ codeDescription: 'Unauthorized', serverCode: 401 }));
        }
        return page({ username: user.username, isSubscribed: user.isSubscribed, name: user.name });
    },
});

export default define.page<typeof handler>(({ data }) => (
    <main>
        <h1>User {data.username}</h1>
        <form method='POST'>
            <div>
                <label for='name'>Name</label> <br />
                <input type='text' name='name' id='name' value={data.name} required />
            </div>
            <button>Save</button>
        </form>
        <p>
            <a href='/'>Back</a>
        </p>
        <p>
            <a href='/user/signout'>Signout</a>
        </p>
        <p>
            {data.isSubscribed
                ? <a href='/user/subscription'>Manage Subscription</a>
                : <a href='/user/subscribe'>Subscribe</a>}
        </p>
    </main>
));
