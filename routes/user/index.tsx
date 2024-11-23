import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user-data.ts';
import { UserUI } from '@/islands/UserUI.tsx';
import { STATUS_CODE } from '@std/http/status';
import { Meth } from '@/lib/meth.ts';
import { sendEmailVerification } from '@/lib/mail.ts';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    if (ctx.req.method == 'GET') return page();
    try {
      const { email, name } = Meth.formDataToObject(await ctx.req.formData());
      const newUser = await updateUser({ ...user, name, email });
      if (newUser.email != user.email) await sendEmailVerification(ctx.url.origin, user);
      return page({ message: 'Saved!', error: undefined });
    } catch (e) {
      return page({ message: undefined, error: Meth.getErrorMessage(e) });
    }
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <h1>User Settings</h1>
    {/* <UserUI message={data?.message} error={data?.error} /> */}
  </Page>
));
