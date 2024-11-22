import { define } from '@/lib/utils.ts';
import ChatBox from '../islands/ChatBox.tsx';
import { page } from 'fresh';
import { site } from '@/lib/site.ts';
import { Page } from '@/components/Page.tsx';
import { GetChatData } from '@/lib/chatdata.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) return page();
    const chatData = await GetChatData(ctx.state.user);
    return page({ chatData });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <Page>
      {data?.chatData ? <ChatBox data={data.chatData} /> : (
        <>
          <h1>Paracelsus</h1>
          <p>{site.description}</p>
          <p>
            <a href='/user/signin'>Sign In</a> to chat.
          </p>
        </>
      )}
    </Page>
  );
});
