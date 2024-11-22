import { define } from '@/lib/utils.ts';
import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { STATUS_CODE } from '@std/http/status';
import { sendFollowUp } from '@/lib/follow-up.ts';

export const handler = define.handlers(async (ctx) => {
  const user = ctx.state.user;
  if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
  await sendFollowUp(user);
  return new Response(user.pushSubscriptions.length + '', { status: 201 });
});
