import { define } from '@/lib/utils.ts';
import ChatBox from '@/islands/ChatBox.tsx';
import { page } from 'fresh';
import { site } from '@/app/site.ts';
import { Page } from '@/components/Page.tsx';
import { getChatData } from '@/app/chat-data.ts';

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
      {data?.chatData ? <ChatBox data={data.chatData} /> : (
        <>
          <h1>{site.name}</h1>
          <p>{site.description}</p>
          <p>
            <a href='/user/signup'>Sign Up</a> to chat.
          </p>
        </>
      )}
    </Page>
  );
});
