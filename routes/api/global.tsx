import { define } from '@/lib/utils.ts';
import { handleSSE } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { getUserFromState } from '@/lib/user.ts';
import { HttpError } from 'fresh';

export const handler = define.handlers(async (ctx) => {
    const user = await getUserFromState(ctx);
    if (!user) throw new HttpError(401);

    return handleSSE(async (send) => {
        for await (const event of db.watch([['users', user.id]])) {
            if (event[0].versionstamp === null) continue;
            const { name, isSubscribed, tokens } = event[0].value as User;
            const globalData = {
                user: { name, isSubscribed, tokens },
            };
            send(globalData);
        }
    });
});
