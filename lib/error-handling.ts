import { STATUS_CODE, STATUS_TEXT } from '@std/http/status';
import { BadRequestError, UnauthorizedError } from '@/lib/http.ts';
import { define } from '@/lib/utils.ts';


export function toErrorStatus(error: Error) {
    if (error instanceof Deno.errors.NotFound) return STATUS_CODE.NotFound;
    if (error instanceof UnauthorizedError) return STATUS_CODE.Unauthorized;
    if (error instanceof BadRequestError) return STATUS_CODE.BadRequest;
    return STATUS_CODE.InternalServerError;
}

export default define.middleware(async ctx => {

    if (ctx.url.pathname.includes("/api")) {
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
        if (e instanceof UnauthorizedError) {
            return ctx.redirect("/user/signin");
        }
        throw e;
    }


});