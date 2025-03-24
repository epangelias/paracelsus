import { define } from '../lib/utils.ts';
import { page } from 'fresh';
import { Page } from '@/components/Page.tsx';
import { getChatData } from '@/app/chat-data.ts';
import { AppUI } from '@/islands/AppUI.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) return ctx.redirect('/welcome');
    const chatData = await getChatData(ctx.state.user);
    return page({ chatData });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <Page hideHeader={!data?.chatData} fullWidth={!!data?.chatData}>
      <AppUI chatData={data?.chatData} />
    </Page>
  );
});
