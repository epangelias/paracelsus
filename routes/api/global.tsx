import { define } from '@/lib/utils.ts';
import { handleSSE } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers((ctx) => {
    if (!ctx.state.user) throw new HttpError(401);

    return handleSSE(async (send) => {
        for await (const event of db.watch([['users', ctx.state.user!.id]])) {
            if (event[0].versionstamp === null) continue;
            const { name, isSubscribed, tokens } = event[0].value as User;
            const globalData = {
                user: { name, isSubscribed, tokens },
            };
            send(globalData);
        }
    });
});
