import { HttpError } from 'https://jsr.io/@fresh/core/2.0.0-alpha.25/src/error.ts';
import { STATUS_CODE } from '@std/http/status';
import { ChatData, UserData } from '@/lib/types.ts';
import { sendNotificationToUser } from '@/lib/push.ts';
import { db } from '@/lib/utils.ts';
import { generateChatCompletion } from '@/lib/oai.ts';

async function generateFollowUpMessage(user: UserData) {
  const chatData = await db.get<ChatData>(['chat', user.id]);
  if (chatData.versionstamp === null) throw new Error('Chat data not found');
  if (chatData.value.messages.at(-2)?.role == 'assistant') throw new Error('Already sent a follow up message');
  const messages = chatData.value.messages.map(({ role, content }) => ({ role, content }));
  messages.push({
    role: 'system',
    content:
      `Follow up to ${user.name} in one sentence to start a conversation with them, you may ask them a question too.`,
  });
  const res = await generateChatCompletion(undefined, messages);
  const content = res.choices[0].message.content;
  if (!content) throw new Error('No content generated');
  chatData.value.messages.push({ role: 'assistant', content });
  await db.set(['chat', user.id], chatData.value);
  return content;
}

export async function sendFollowUp(user: UserData) {
  if (user.pushSubscriptions.length === 0) {
    throw new HttpError(STATUS_CODE.BadRequest, 'No push subscriptions found');
  }
  const message = await generateFollowUpMessage(user);
  await sendNotificationToUser(user, 'Paracelsus Hath Spoken', message);
}

export function AutoSendFollowUps() {
  // Disable cron if running in github actions
  if (Deno.env.get('GITHUB_ACTIONS') === 'true') return;

  Deno.cron(`follow-up`, { minute: { every: 5 } }, async () => {
    console.log('Following up...');
    for await (const res of db.list<UserData>({ prefix: ['users'] })) {
      const user = res.value;
      try {
        await sendFollowUp(user);
      } catch (e) {
        console.error(`Failed to send follow up to ${user.email}`, e);
      }
      console.log('Sent follow up to ' + res.value.name);
    }
  });
}
