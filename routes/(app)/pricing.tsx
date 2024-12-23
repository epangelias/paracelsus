import { define } from '@/lib/utils/utils.ts';
import { Page } from '@/components/Page.tsx';
import IconCheckCircle from 'tabler-icons/circle-check-filled.tsx';

export default define.page((ctx) => (
  <Page hideBanner={true}>
    <h1>Pricing</h1>

    <div class=''>
      <div>
        <h2>Free</h2>
        <p>
          Use Paracelsus for free
        </p>
      </div>
      <p>
        $0
      </p>
      <p>
        <IconCheckCircle />
        Limited tokens
      </p>

      <a href='/' class='button'>Get Started</a>
    </div>

    <div class=''>
      <div>
        <h2>Premium</h2>
        <p>
          Unlock all features of Paracelsus.
        </p>
      </div>
      <p>
        $5 / month
      </p>
      <p>
        <IconCheckCircle />
        Unlimited tokens
      </p>
      <a href='/user/subscribe' class='button'>Subscribe</a>
    </div>
  </Page>
));
