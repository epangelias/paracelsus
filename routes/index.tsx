import { define } from '@/lib/utils.ts';
import { site } from '@/lib/site.ts';
import { db } from '@/lib/db.ts';
import { ChatData } from '@/lib/types.ts';
import ChatBox from '@/islands/ChatBox.tsx';

export default define.page(async ({ state }) => {
  let chatData: ChatData = { messages: [] };
  if (state.user) {
    const res = await db.get<ChatData>(['chat', state.user.id]);
    if (res.value) chatData = res.value;
  }

  return (
    <main>
      <h1>{site.name}</h1>
      <ChatBox data={chatData} />
    </main>
  );
});
