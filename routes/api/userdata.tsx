import { define } from '@/lib/utils.ts';
import { StreamSSR } from '../../lib/stream-sse.ts';
import { db } from '@/lib/utils.ts';
import { UserData } from '@/lib/types.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { stripUserData } from '@/lib/user-data.ts';

export const handler = define.handlers((ctx) => {
  if (!ctx.state.user || !ctx.state.auth) throw new HttpError(STATUS_CODE.Unauthorized);

  return StreamSSR({
    async onChunk(send) {
      const userKey: Deno.KvKey = ['users', ctx.state.user!.id];

      for await (const [user] of db.watch<[UserData]>([userKey])) {
        if (user.versionstamp !== null) send(stripUserData(user.value));
        else send(null);
      }
    },
  });
});
