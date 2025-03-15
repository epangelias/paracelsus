import { define } from '@/lib/utils/utils.ts';
import { HttpError, page } from 'fresh';
import { setUserData } from '@/lib/user/user-data.ts';
import { UserUI } from '@/islands/UserUI.tsx';
import { STATUS_CODE } from '@std/http/status';

import { Page } from '@/components/Page.tsx';
import { sendEmailVerification } from '@/app/email.tsx';
import { formDataToObject, getErrorMessage } from '@/lib/utils/meth.ts';
import { delay } from '@std/async/delay';

export const handler = define.handlers({
  GET: (ctx) => {
    ctx.state.title = 'User Settings';
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    return page();
  },
  POST: async (ctx) => {
    try {
      const user = ctx.state.user;
      if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
      const { email, name } = formDataToObject(await ctx.req.formData());
      const newUser = await setUserData(user.id, (u) => {
        u.name = name;
        u.email = email;
      });

      if (newUser.email != user.email) await sendEmailVerification(ctx.url.origin, user);

      await delay(1000); // TESTING

      return new Response('Saved!');
    } catch (e) {
      throw new HttpError(400, getErrorMessage(e));
    }
  },
});

export default define.page<typeof handler>(() => (
  <Page>
    <h1>User Settings</h1>
    <UserUI />
  </Page>
));
