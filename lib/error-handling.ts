import { STATUS_CODE, STATUS_TEXT } from '@std/http/status';
import { define } from '@/lib/utils.ts';

export function toErrorStatus(error: Error) {
  if (error instanceof Deno.errors.NotFound) return STATUS_CODE.NotFound;
  return STATUS_CODE.InternalServerError;
}

export default define.middleware(async (ctx) => {
  if (ctx.url.pathname.includes('/api')) {
    try {
      return await ctx.next();
    } catch (e) {
      const status = toErrorStatus(e);
      return new Response(e.message, {
        statusText: STATUS_TEXT[status],
        status,
      });
    }
  }

  try {
    return await ctx.next();
  } catch (e) {
    if (e.status == 401) {
      return ctx.redirect('/user/signin');
    }
    throw e;
  }
});
