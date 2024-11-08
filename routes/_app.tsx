import { EmojiFavicon } from '@/components/EmojiFavicon.tsx';
import { siteData } from '../lib/siteData.ts';
import { WebAppify } from '@/components/WebAppify.tsx';
import { Global } from '../islands/Global.tsx';
import { GlobalData } from '@/lib/types.ts';
import { define } from '@/lib/utils.ts';

export default define.page((props) => {
  const user = props.state.user;

  const globalData: GlobalData = {};

  if (user) {
    globalData.user = { name: user.name, tokens: user.tokens, isSubscribed: user.isSubscribed };
  }

  const js = Deno.readTextFileSync(import.meta.resolve('../static/src/init.js').slice(7));

  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta
          content='minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no'
          name='viewport'
        />
        <title>{siteData.title}</title>
        <link rel='stylesheet' href='/css/main.css' />
        <meta name='color-scheme' content='light dark' />
        <EmojiFavicon emoji={siteData.emojiFavicon} />
        <WebAppify themeColor={siteData.themeColor} />
      </head>
      <body>
        <Global data={globalData}>
          <props.Component />
        </Global>

        <script dangerouslySetInnerHTML={{ __html: js }}></script>
      </body>
    </html>
  );
});
