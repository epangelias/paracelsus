import { define } from '@/lib/utils.ts';
import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { STATUS_CODE } from '@std/http/status';
import { sentNotificationsToUser } from '@/lib/push.ts';
import { ChatData, UserData } from '@/lib/types.ts';
import { db } from '@/lib/utils.ts';
import { generateChatCompletion } from '@/lib/oai.ts';


async function generateFollowUpMessage(user: UserData) {
    const chatData = await db.get<ChatData>(['chat', user.id]);
    if (chatData.versionstamp === null) return null;
    const messages = chatData.value.messages.map(({ role, content }) => ({ role, content }));
    messages.push({ role: "system", content: `Follow up to ${user.name} with a short message try to start a conversation with them.` });
    const res = await generateChatCompletion(undefined, messages);
    const content = res.choices[0].message.content;
    if (!content) return null;
    chatData.value.messages.push({ role: "assistant", content });
    await db.set(['chat', user.id], chatData.value);
    return content;
}



export const handler = define.handlers(async (ctx) => {
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    const message = await generateFollowUpMessage(user);
    if (!message) throw new HttpError(500, "No message generated");
    await sentNotificationsToUser(user, "Paracelsus Hath Spoken", message);
    return new Response(user.pushSubscriptions.length + "", { status: 201 })
})