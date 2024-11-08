import { define } from '@/lib/utils.ts';
import { siteData } from '@/lib/siteData.ts';
import { db } from '@/lib/db.ts';
import { page } from 'fresh';
import { ChatData, CounterData } from '@/lib/types.ts';
import ChatBox from '@/islands/ChatBox.tsx';
import { getUserFromState } from '../lib/user.ts';

export const handler = define.handlers({
  async GET(ctx) {
    const user = await getUserFromState(ctx);
    const counterData = (await db.get<CounterData>(['counterData'])).value || { count: 0 };
    const chatData = (await db.get<ChatData>(['chat'])).value || { messages: [] };
    return page({ counterData, chatData, user });
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <main>
      <p>
        {data.user
          ? <a href='/user'>{data.user.name} {data.user.isSubscribed && '🪙'}</a>
          : <a href='/user/signin'>Sign In</a>}
      </p>
      <h1>{siteData.name}</h1>
      {data.user ? <ChatBox data={data.chatData} /> : <p>Sign in to chat</p>}
    </main>
  );
});
