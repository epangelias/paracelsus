import { define } from '@/lib/utils.ts';
import { deleteCookie } from 'jsr:@std/http/cookie';

export const handler = define.handlers({
    GET: (ctx) => {
        const res = ctx.redirect('/');
        deleteCookie(res.headers, 'auth', { path: '/' });
        return res;
    },
});
