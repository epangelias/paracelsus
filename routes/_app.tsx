import { site } from '@/lib/site.ts';
import { createGlobalData, Global } from '@/islands/Global.tsx';
import { define } from '@/lib/utils.ts';
import { InitJS } from '../components/InitJS.tsx';
import { Header } from '@/islands/Header.tsx';

export default define.page(({ Component, state }) => {
  return (
    <html lang={site.lang}>
      <head>
        <title>{site.name}</title>
        <meta charset='utf-8' />
        <meta name='description' content={site.description} />
        <meta
          content='minimum-scale=1.0, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
          name='viewport'
        />
        <meta name='color-scheme' content='light dark' />
        <link rel='apple-touch-icon' href={site.favicon} />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content={site.themeColor} />
        <link rel='manifest' href='/manifest.json' />
        <link rel='stylesheet' href='/css.css' />
        <link rel='icon' href={site.favicon} />
      </head>
      <body>
        <div class='container'>
          <Global data={createGlobalData(state.user)}>
            <Header />
            <Component />
          </Global>
        </div>
        <InitJS />
      </body>
    </html>
  );
});
