import { define } from '@/lib/utils.ts';
import { ChatData } from '@/lib/types.ts';
import ChatBox from '../islands/ChatBox.tsx';
import { HttpError, page } from 'fresh';
import { GetChatData } from '@/routes/api/chat.tsx';
import { STATUS_CODE } from '@std/http/status';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const chatData = await GetChatData(ctx.state.user);
    return page({ chatData });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <main>
      <ChatBox data={data.chatData} />
    </main>
  );
});
