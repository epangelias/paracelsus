import { Page } from '@/components/Page.tsx';
import { define } from '@/lib/utils/utils.ts';

export default define.page(() => (
  <Page hideBanner={true} hideHeader={true}>
    <h1>Your Offline!</h1>
    <p>
      <a href='/'>Back</a>
    </p>
  </Page>
));
