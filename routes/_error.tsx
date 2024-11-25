/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code looks clean and well-organized.
Consistent naming conventions and code style are used throughout the file.
Error handling is properly implemented with proper status codes and error messages.

However, there are a few potential issues:

The !ctx.error condition may lead to unexpected behavior if ctx.error is falsy but not null or undefined.
The ctx.error instanceof Error check may not catch all error types, consider using instanceof HttpError || e.constructor === Error.
The ctx.data as unknown as { statusText: string } casting may throw an error if ctx.data does not contain a statusText property.
The try-catch block in the handler function is quite long and complex, consider breaking it down into smaller functions for better readability and maintainability.

No security issues or performance issues are detected.
Overall, the code is well-written and maintainable.
*/


import { define } from '@/lib/utils.ts';
import { STATUS_CODE, STATUS_TEXT, StatusCode } from '@std/http/status';
import { HttpError, page } from 'fresh';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers(async (ctx) => {
  const isAPI = !!ctx.url.pathname.match(/^\/api\//);

  try {
    if (!ctx.error) return await ctx.next();
    else if (typeof ctx.error === 'string') {
      throw new HttpError(STATUS_CODE.InternalServerError);
    } else if (ctx.error instanceof Error) {
      throw new HttpError(STATUS_CODE.InternalServerError);
    } else if (ctx.error instanceof HttpError) throw ctx.error;
    else throw new HttpError(STATUS_CODE.NotFound);
  } catch (e) {
    const { status, message } = e as HttpError;
    if (isAPI) {
      return new Response(message, { statusText: STATUS_TEXT[status as StatusCode], status });
    }
    if (status == 401) return ctx.redirect('/user/signin');
    return page({ status, statusText: message });
  }
});

export default define.page((ctx) => {
  return (
    <Page>
      <h1>{(ctx.data as unknown as { statusText: string }).statusText}</h1>
      <p>
        <a href='/'>Go Back</a>
      </p>
    </Page>
  );
});
