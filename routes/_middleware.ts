import { define, State } from '@/lib/utils.ts';
import { FreshContext } from 'fresh';


export default define.middleware((ctx) => {
    console.log(`${ctx.req.method} ${ctx.req.url}`);
    return ctx.next();
});

