import { define } from '@/lib/utils.ts';
import { Page } from '@/components/Page.tsx';

const CSS = await Deno.readTextFile('static/css/main.css') +
  await Deno.readTextFile('static/css/theme.css');

export default define.page(() => (
  <Page hideHeader={true} hideBanner={true}>
    <h1>Your Offline!</h1>
    <p>
      <a href='/'>Reload</a>
    </p>
    <style dangerouslySetInnerHTML={{ __html: CSS }}></style>
  </Page>
));
