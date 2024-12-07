import { App, HttpError } from 'fresh';
import { State } from '@/app/types.ts';
import { clearDb } from '@/tasks/db_reset.ts';
import { STATUS_CODE } from '@std/http/status';
import { sendFollowUp } from '@/app/follow-up.ts';

export function testingPlugin(app: App<State>) {
    app.get("/clear-db", async () => {
        await clearDb();
        return new Response('DONE');
    });

    app.get("/test-push", async (ctx) => {
        const user = ctx.state.user;
        if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
        await sendFollowUp(user);
        return new Response(user.pushSubscriptions.length + '', { status: 201 });
    })
}