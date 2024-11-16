import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user.ts';
import { UserUI } from '@/islands/UserUI.tsx';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers(async (ctx) => {
  const user = ctx.state.user;
  if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
  if (ctx.req.method == 'GET') return page();
  try {
    const formData = await ctx.req.formData();
    user.name = formData.get('name') as string;
    await updateUser(user);
    return page({ message: 'Saved!', error: undefined });
  } catch (e) {
    return page({ error: e.message, message: undefined });
  }
});

export default define.page<typeof handler>(({ data }) => (
  <main>
    <h1>User Settings</h1>
    <UserUI message={data?.message} error={data?.error} />
  </main>
));
