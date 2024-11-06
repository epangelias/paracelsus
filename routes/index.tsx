import { define } from '@/lib/utils.ts';
import Counter from '@/islands/Counter.tsx';
import { siteData } from '@/lib/siteData.ts';
import { db } from '@/lib/db.ts';
import { page } from 'fresh';
import { ChatData, CounterData } from '@/lib/types.ts';
import ChatBox from '@/islands/ChatBox.tsx';
import { getUserFromContext } from '@/lib/auth.ts';

export const handler = define.handlers({
  async GET(ctx) {
    const user = await getUserFromContext(ctx);
    const counterData = (await db.get<CounterData>(['counterData'])).value || { count: 0 };
    const chatData = (await db.get<ChatData>(['chat'])).value || { messages: [] };
    return page({ counterData, chatData, user });
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <main>
      <p>
        User: {data.user ? 'IN ' : 'OUT '}
        <a href='/user/signin'>Signin</a> <a href='/user/signout'>Signout</a>{' '}
        <a href='/user/signup'>Signup</a>
      </p>
      <h1>{siteData.title}</h1>
      <Counter data={data.counterData} />
      <ChatBox data={data.chatData} />
    </main>
  );
});
