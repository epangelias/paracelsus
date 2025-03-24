import { define } from '../lib/utils.ts';
import { asset } from 'fresh/runtime';
import { site } from '@/app/site.ts';
import { Page } from '@/components/Page.tsx';

export default define.page(() => (
  <Page hideHeader>
    <div class='onboard-section'>
      <img src={asset('/img/icon.webp')} alt='' height={84} />
      <h1>Welcome to {site.name}!</h1>
      <p>{site.description}</p>
      <br />
      <a href='/signin' class='button'>Get Started</a>
    </div>
  </Page>
));
