import { define } from '@/lib/utils.ts';
import { handleSSE } from '../../lib/handle-sse.ts';
import { db } from '@/lib/db.ts';
import { User } from '@/lib/types.ts';
import { createGlobalData } from '@/islands/Global.tsx';

export const handler = define.handlers((ctx) => {
    if (!ctx.state.user) return handleSSE(async () => {});

    return handleSSE(async (send) => {
        for await (const event of db.watch([['users', ctx.state.user!.id]])) {
            if (event[0].versionstamp === null) continue;
            const user = event[0].value as User;
            const globalData = createGlobalData(user);
            send(globalData);
        }
    });
});
