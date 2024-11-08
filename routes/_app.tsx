import { Favicon } from '../components/Favicon.tsx';
import { siteData } from '../lib/siteData.ts';
import { WebAppify } from '@/components/WebAppify.tsx';
import { createGlobalData, Global } from '../islands/Global.tsx';
import { define } from '@/lib/utils.ts';
import { InitJS } from '@/components/InitJS.tsx';

export default define.page(({ Component, state }) => {
  return (
    <html lang={siteData.lang}>
      <head>
        <meta charset='utf-8' />
        <meta
          content='minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no'
          name='viewport'
        />
        <title>{siteData.name}</title>
        <link rel='stylesheet' href='/css/main.css' />
        <meta name='color-scheme' content='light dark' />
        <Favicon icon={siteData.favicon} />
        <WebAppify />
      </head>
      <body>
        <Global data={createGlobalData(state.user)}>
          <Component />
        </Global>
        <InitJS />
      </body>
    </html>
  );
});
