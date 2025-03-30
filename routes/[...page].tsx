import { Page } from '@/components/Page.tsx';
import { define } from '../lib/utils.ts';
import { HttpError, page } from 'fresh';
import { getPage } from '../lib/page.ts';

export const handler = define.handlers(async (ctx) => {
  const pageData = await getPage(ctx.params.page);
  if (!pageData) throw new HttpError(404);
  ctx.state.title = pageData.title;
  return page(pageData);
});

export default define.page<typeof handler>(({ data }) => (
  <Page hideBanner={data.hideBanner} hideHeader={data.hideHeader}>
    <div dangerouslySetInnerHTML={{ __html: data.html }}></div>
  </Page>
));
