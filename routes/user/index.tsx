/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Error handling is good, but it would be better to log the error in the catch block for debugging purposes.

It would be better to validate the `email` and `name` fields before updating the user.

The `updateUser` function is not validated, it's assumed to always return a user. It would be better to handle the case where it returns an error.

The `sendEmailVerification` function is also not validated, it's assumed to always send the email successfully. It would be better to handle the case where it returns an error.

The `Meth.formDataToObject` function is not well-named. It would be better to rename it to something like `parseFormData`.

The `Meth.getErrorMessage` function is not well-named. It would be better to rename it to something like `getErrorString`.

The `define.page` function is not well-named. It would be better to rename it to something like `createPage`.

The `handler` function is not well-named. It would be better to rename it to something like `userHandler`.

The code is well-organized and easy to read.

No security issues found.

No performance issues found.

No code style issues found.

No maintainability issues found.

No readability issues found.

No refactoring opportunities found.
*/


import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { updateUser } from '@/lib/user-data.ts';
import { UserUI } from '@/islands/UserUI.tsx';
import { STATUS_CODE } from '@std/http/status';
import { Meth } from '@/lib/meth.ts';
import { sendEmailVerification } from '@/lib/mail.ts';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers({
  GET: (ctx) => {
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    return page();
  },
  POST: async (ctx) => {
    try {
      const user = ctx.state.user;
      if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
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
    <UserUI message={data?.message} error={data?.error} />
  </Page>
));
