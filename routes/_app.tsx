import type { PageProps } from 'fresh';
import { EmojiFavicon } from '@/components/EmojiFavicon.tsx';
import { siteData } from '../lib/siteData.ts';
import { WebAppify } from '@/components/WebAppify.tsx';
import { ThemeSwitcher } from '@/islands/ThemeSwitcher.tsx';

export default function App({ Component }: PageProps) {
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
        <main>
          <Component />
          <ThemeSwitcher />
        </main>
      </body>
    </html>
  );
}
