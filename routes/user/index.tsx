import { define } from '@/lib/utils.ts';

export default define.page(() => (
    <main>
        <h1>User</h1>
        <p>
            <a href='/user/signout'>Signout</a>
        </p>
        <p>
            <a href='/user/subscription'>Manage Subscription</a>
        </p>
        <p>
            <a href='/user/subscribe'>Subscribe</a>
        </p>
    </main>
));
