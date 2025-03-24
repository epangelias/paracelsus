import { State } from '@/app/types.ts';
import { App } from 'fresh';
import { define } from '@/lib/utils/utils.ts';
import { getUserByAuth } from '@/lib/user/user-data.ts';
import { getCookies } from '@std/http';
import { isOauthEnabled } from '@/lib/oauth.ts';

export function userPlugin(app: App<State>) {
  app.use(async (ctx) => {
    if (!isOauthEnabled()) {
      ctx.state.user = {
        id: '',
        email: null,
        created: 0,
        isSubscribed: true,
        hasSubscribed: true,
        name: '',
        pushSubscriptions: [],
        tokens: 0,
      };
      return await ctx.next();
    }

    // Skip static assets
    if (!ctx.req.url.includes('?__frsh_c=') && !ctx.req.url.includes('/_fresh')) {
      const auth = getCookies(ctx.req.headers)['site-session'];
      ctx.state.auth = auth;
      if (auth) {
        const user = await getUserByAuth(auth);
        if (user) ctx.state.user = user;
      }
    }
    return await ctx.next();
  });
}

export default define.page(() => <p>hi</p>);
