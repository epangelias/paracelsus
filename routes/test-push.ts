import { define } from '@/lib/utils.ts';
import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { STATUS_CODE } from '@std/http/status';
import { sendNotificationsToUser } from '@/lib/push.ts';
import { ChatData, UserData } from '@/lib/types.ts';
import { db } from '@/lib/utils.ts';
import { generateChatCompletion } from '@/lib/oai.ts';


async function generateFollowUpMessage(user: UserData) {
    const chatData = await db.get<ChatData>(['chat', user.id]);
    if (chatData.versionstamp === null) return null;
    if (chatData.value.messages.at(-2)?.role == "assistant") throw new Error("Already sent follow up message");
    const messages = chatData.value.messages.map(({ role, content }) => ({ role, content }));
    messages.push({ role: "system", content: `Follow up to ${user.name} with a short message try to start a conversation with them.` });
    const res = await generateChatCompletion(undefined, messages);
    const content = res.choices[0].message.content;
    if (!content) return null;
    chatData.value.messages.push({ role: "assistant", content });
    await db.set(['chat', user.id], chatData.value);
    return content;
}

async function sendFollowUp(user: UserData) {
    if (user.pushSubscriptions.length === 0) throw new HttpError(STATUS_CODE.BadRequest, "No push subscriptions found");
    const message = await generateFollowUpMessage(user);
    if (!message) throw new HttpError(500, "No message generated");
    await sendNotificationsToUser(user, "Paracelsus Hath Spoken", message);
}

export function sendFollowUpsContinuously() {
    if (!Deno.env.has("CRON")) return;
    console.log("Setting chron task");
    Deno.cron(`Follow up users`, { minute: { every: 1 } }, async () => {
        console.log("Following up...");
        for await (const res of db.list<UserData>({ prefix: ['users'] })) {
            console.log("Following up " + res.value.name);
            const user = res.value;
            try {
                await sendFollowUp(user);
            } catch (e) {
                console.error(`Failed to send follow up to ${user.email}`, e);
            }
        }
    });
}


export const handler = define.handlers(async (ctx) => {
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    await sendFollowUp(user);
    return new Response(user.pushSubscriptions.length + "", { status: 201 })
})