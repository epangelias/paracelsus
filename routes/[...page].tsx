import { Page } from '@/components/Page.tsx';
import { define } from '@/lib/utils/utils.ts';
import { HttpError, page } from 'fresh';
import { getPage } from '@/lib/utils/page.ts';
import { GetTS } from '@/lib/get-ts.ts';

export const handler = define.handlers(async (ctx) => {
  const pageData = await getPage(ctx.params.page);
  if (!pageData) {
    const TS = await GetTS(ctx.params.page);
    if (!TS) throw new HttpError(404);
    return TS;
  }
  ctx.state.title = pageData.title;
  return page(pageData);
});

export default define.page<typeof handler>(({ data: { html: __html } }) => (
  <Page>
    <div dangerouslySetInnerHTML={{ __html }}></div>
  </Page>
));
