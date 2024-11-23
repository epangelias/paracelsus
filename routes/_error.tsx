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
