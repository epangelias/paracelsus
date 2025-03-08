import { site } from '@/app/site.ts';
import { define } from '@/lib/utils/utils.ts';
import { asset } from 'fresh/runtime';
import { Global } from '@/islands/Global.tsx';
import { PWATags } from '@/lib/pwa/PWATags.tsx';
import { CSSVar } from '@/components/CSSVar.tsx';
import { passGlobalData } from '@/lib/passGlobalData.ts';

export default define.page(({ Component, state }) => {
  return (
    <html lang={site.lang} class='theme-light'>
      <head>
        <title>{state.title ? (state.title + ' – ' + site.name) : site.name}</title>
        <meta content={site.name} property='og:title'></meta>
        <meta content={site.description} name='description' />
        <meta content={site.description} property='og:description' />
        <meta content={asset('/img/screenshot-wide.jpg')} property='og:image' />
        <meta property='og:type' content='website' />
        <meta charset='utf-8' />
        <meta name='color-scheme' content='light dark' />
        {
          /* <meta
          name='viewport'
          content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
        /> */
        }
        <meta
          name='viewport'
          content='initial-scale=1,maximum-scale=1'
        />

        <link rel='stylesheet' href={asset('/css/theme/theme.css')} />
        <link rel='stylesheet' href={asset('/css/main.css')} />
        <link rel='stylesheet' href={asset('/css/dialog.css')} />
        <link rel='stylesheet' href={asset('/css/components.css')} />
        <link rel='icon' href={asset('/favicon.ico')} />

        <script type='module' src={asset('/js/init.js')}></script>

        <PWATags />
        <CSSVar primary={site.themeColor} on-primary='#000' />
      </head>
      <body>
        <Global data={passGlobalData(state)}>
          <Component />
        </Global>
      </body>
    </html>
  );
});
