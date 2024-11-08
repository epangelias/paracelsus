import { siteData } from '@/lib/siteData.ts';

export function WebAppify() {
    return (
        <>
            {/* <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' /> */}
            <link rel='apple-touch-icon' href={siteData.favicon} />
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='msapplication-tap-highlight' content='no' />
            <meta name='theme-color' content={siteData.themeColor} />
            <link rel='manifest' href='/manifest.json' />
        </>
    );
}
