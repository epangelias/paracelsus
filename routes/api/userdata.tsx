import { define } from '../../lib/utils.ts';
import { StreamSSR } from '@/lib/stream/stream-sse.ts';
import { db } from '../../lib/utils.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { UserData } from '@/lib/user/user-data.ts';
import { stripUserData } from '@/lib/global-data.ts';

export const handler = define.handlers((ctx) => {
  if (!ctx.state.user || !ctx.state.auth) throw new HttpError(STATUS_CODE.Unauthorized);

  const key: Deno.KvKey = ['users', ctx.state.user!.id];

  return StreamSSR({
    async onChunk(send) {
      for await (const [user] of db.watch<[UserData]>([key])) {
        if (user.versionstamp === null) continue;
        send(stripUserData(user.value));
      }
    },
  });
});
