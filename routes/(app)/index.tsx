import { define } from '@/lib/utils/utils.ts';
import { page } from 'fresh';
import { Page } from '@/components/Page.tsx';
import { getChatData } from '@/app/chat-data.ts';
import { OnboardSection } from '@/components/OnboardSection.tsx';
import { AppUI } from '@/islands/AppUI.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) return page({ chatData: null, hideHeader: true });
    const chatData = await getChatData(ctx.state.user);
    return page({ chatData, hideHeader: false });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <Page hideHeader={data?.hideHeader}>
      {data?.chatData ? <AppUI chatData={data?.chatData} /> : <OnboardSection />}
    </Page>
  );
});
