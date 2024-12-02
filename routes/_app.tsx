import { site } from '../app/site.ts';
import { define } from '@/lib/utils.ts';
import { asset } from 'fresh/runtime';
import { Global } from '@/islands/Global.tsx';
import { stripUserData } from '@/app/user.ts';
import { PWATags } from '../lib/components/PWATags.tsx';

export default define.page(({ Component, state }) => {
  return (
    <html lang={site.lang}>
      <head>
        <title>{site.name}</title>
        <meta content={site.name} property='og:title'></meta>
        <meta content={site.description} name='description' />
        <meta content={site.description} property='og:description' />
        <meta content={asset('/img/screenshot.jpg')} property='og:image' />
        <meta property='og:type' content='website' />
        <meta charset='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
        />

        {/* Modify this to change the theme */}
        <meta name='color-scheme' content='light dark' />

        <PWATags />

        <style dangerouslySetInnerHTML={{ __html: `:root{--primary: ${site.themeColor}` }}></style>
        <link rel='stylesheet' href={asset('/css/theme.css')} />
        <link rel='stylesheet' href={asset('/css/main.css')} />
        <link rel='stylesheet' href={asset('/css/components.css')} />
        <link rel='icon' href={asset(site.icon)} />
      </head>
      <body>
        <Global user={stripUserData(state.user)}>
          <Component />
        </Global>

        <script src={asset('/js/init.js')}></script>
      </body>
    </html>
  );
});
