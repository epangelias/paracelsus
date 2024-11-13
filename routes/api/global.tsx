import { define } from '@/lib/utils.ts';
import { handleSSE } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { createGlobalData } from '@/islands/Global.tsx';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers((ctx) => {
    if (!ctx.state.user || !ctx.state.auth) throw new HttpError(STATUS_CODE.Unauthorized);

    return handleSSE(async (send) => {
        const userKey: Deno.KvKey = ['users', ctx.state.user!.id];
        const authKey: Deno.KvKey = ['usersByAuth', ctx.state.auth!];

        for await (const [user] of db.watch<[User]>([userKey])) {
            let globalData = createGlobalData();

            if (user.versionstamp !== null) {
                globalData = createGlobalData(user.value);
            }

            send(globalData);
        }

        for await (const [auth] of db.watch<[{ id: string }]>([authKey])) {
            if (auth.versionstamp !== null) {
                send(createGlobalData());
            }
        }
    });
});
