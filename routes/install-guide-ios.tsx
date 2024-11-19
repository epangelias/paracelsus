import { define } from '@/lib/utils.ts';
import { Page } from '@/components/Page.tsx';

export default define.page(() => (
  <Page hideBanner={true}>
    <img src='/img/guide-ios.jpg' alt='' style={{ width: '100%', maxWidth: '800px' }} />
  </Page>
));
