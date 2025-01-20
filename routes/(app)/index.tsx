import { define } from '@/lib/utils/utils.ts';
import ChatBox from '@/islands/ChatBox.tsx';
import { page } from 'fresh';
import { site } from '@/app/site.ts';
import { Page } from '@/components/Page.tsx';
import { getChatData } from '@/app/chat-data.ts';
import { OnboardSection } from '@/components/OnboardSection.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) return page();
    const chatData = await getChatData(ctx.state.user);
    return page({ chatData });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <Page>
      {data?.chatData ? <ChatBox data={data.chatData} /> : <OnboardSection />}
    </Page>
  );
});
