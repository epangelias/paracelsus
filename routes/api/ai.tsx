import { define } from '@/lib/utils.ts';
import { AIMessage } from '@/lib/types.ts';
import { StreamAI } from '../../lib/stream-ai.ts';
import { updateUser, userHasTokens } from '@/lib/user.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { GetChatData, setChatData } from '../../lib/chat-data.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    const user = ctx.state.user;

    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    if (userHasTokens(user)) throw new HttpError(STATUS_CODE.Unauthorized);
    const chatData = await GetChatData(user);
    if (!chatData) throw new HttpError(STATUS_CODE.NotFound);

    const saveMessages = async (messages: AIMessage[]) => {
      await setChatData({ ...chatData, messages });
      await updateUser({ ...user, tokens: user.tokens - 1 });
    };

    return StreamAI({
      messages: chatData.messages,
      error: saveMessages,
      cancel: saveMessages,
      end: saveMessages,
    });
  },
});
