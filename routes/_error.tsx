import { define } from '@/lib/utils/utils.ts';
import { STATUS_CODE, STATUS_TEXT, StatusCode } from '@std/http/status';
import { HttpError, page } from 'fresh';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers((ctx) => {
  const isAPI = !!ctx.url.pathname.match(/^\/api\//);
  const acceptsHTML = /(text\/html|text\/\*|\*\/\*)/.test(ctx.req.headers.get('accept') ?? '*/*');

  try {
    if (ctx.error instanceof HttpError) throw ctx.error;
    if (ctx.error instanceof Deno.errors.NotFound) throw new HttpError(STATUS_CODE.NotFound);
    console.error(ctx.error);
    throw new HttpError(STATUS_CODE.InternalServerError);
  } catch (e) {
    const { status, message } = e as HttpError;
    if (isAPI || !acceptsHTML) {
      return new Response(message, { statusText: STATUS_TEXT[status as StatusCode], status });
    }
    if (status == STATUS_CODE.Unauthorized) return ctx.redirect('/user/signin');
    ctx.state.title = message;
    return page(message);
  }
});

export default define.page((ctx) => {
  return (
    <Page>
      <h1>{ctx.data as string}</h1>
      <p>
        <a href='/'>Go Back</a>
      </p>
    </Page>
  );
});
