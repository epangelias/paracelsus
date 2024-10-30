import { define } from '@/lib/utils.ts';
import Counter from '@/islands/Counter.tsx';
import { siteData } from '@/lib/siteData.ts';
import { db } from '@/lib/db.ts';
import { page } from 'fresh';
import { CounterData } from '@/lib/types.ts';
import ChatBox from '@/islands/ChatBox.tsx';

export const handler = define.handlers({
  async GET() {
    const { value } = await db.get<CounterData>(['counterData']);
    const counterData = value ?? { count: 0 };
    return page({ counterData });
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <main>
      <div>
        <h1>{siteData.title}</h1>
        <Counter data={data.counterData} />
        <ChatBox />
      </div>
    </main>
  );
});
