import { define } from '@/lib/utils.ts';
import { site } from '@/lib/site.ts';
import { db } from '@/lib/db.ts';
import { ChatData } from '@/lib/types.ts';
import ChatBox from '../islands/ChatBox.tsx';
import { page } from 'fresh';

export const handler = define.handlers({
  GET: async (ctx) => {
    let chatData: ChatData = { messages: [] };
    if (ctx.state.user) {
      const res = await db.get<ChatData>(['chat', ctx.state.user.id]);
      if (res.value) chatData = res.value;
    }
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
