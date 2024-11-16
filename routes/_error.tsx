import { define } from '@/lib/utils.ts';
import { STATUS_TEXT, StatusCode } from '@std/http/status';
import { page } from 'fresh';

export const handler = define.handlers(async (ctx) => {
  const status = (ctx.error as { status: StatusCode }).status;
  const statusText = STATUS_TEXT[status];
  const isAPI = !!ctx.url.pathname.match(/^\/api\//);

  try {
    return await ctx.next();
  } catch (error) {
    const message = (error instanceof Error) ? error.message : String(error);
    if (isAPI) return new Response(message, { statusText, status });
    if (status == 401) return ctx.redirect('/user/signin');
  }
  return page({ status, statusText });
});

export default define.page<typeof handler>((ctx) => {
  return (
    <main>
      <div>
        <h1>{ctx.data.status} {ctx.data.statusText}</h1>
        <p>
          <a href='/'>Go Back</a>
        </p>
      </div>
    </main>
  );
});
