import { Page } from '@/components/Page.tsx';
import { define } from '@/lib/utils/utils.ts';
import { page } from 'fresh';

export const handler = define.handlers((ctx) => {
  ctx.state.title = 'Reset Password';
  return page();
});

export default define.page(() => (
  <Page hideBanner hideHeader>
    <h1>Your Offline!</h1>
    <p>
      <a href='/'>Back</a>
    </p>
  </Page>
));
