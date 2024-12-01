import { asset } from 'fresh/runtime';
import { site } from '@/app/site.ts';

export function WebappTags() {
  return (
    <>
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='theme-color' content={site.themeColor} />
      <meta name='format-detection' content='telephone=no' />
      <link rel='manifest' href={asset('/manifest.json')} />

      <link rel='apple-touch-icon' href={asset('/img/gen/apple-icon-180.png')} />
      {[
        { width: 2048, height: 2732, orientation: 'portrait' },
        { width: 2732, height: 2048, orientation: 'landscape' },
        { width: 1668, height: 2388, orientation: 'portrait' },
        { width: 2388, height: 1668, orientation: 'landscape' },
        { width: 1536, height: 2048, orientation: 'portrait' },
        { width: 2048, height: 1536, orientation: 'landscape' },
        { width: 1488, height: 2266, orientation: 'portrait' },
        { width: 2266, height: 1488, orientation: 'landscape' },
        { width: 1640, height: 2360, orientation: 'portrait' },
        { width: 2360, height: 1640, orientation: 'landscape' },
        { width: 1668, height: 2224, orientation: 'portrait' },
        { width: 2224, height: 1668, orientation: 'landscape' },
        { width: 1620, height: 2160, orientation: 'portrait' },
        { width: 2160, height: 1620, orientation: 'landscape' },
        { width: 1320, height: 2868, orientation: 'portrait' },
        { width: 2868, height: 1320, orientation: 'landscape' },
        { width: 1206, height: 2622, orientation: 'portrait' },
        { width: 2622, height: 1206, orientation: 'landscape' },
        { width: 1290, height: 2796, orientation: 'portrait' },
        { width: 2796, height: 1290, orientation: 'landscape' },
        { width: 1179, height: 2556, orientation: 'portrait' },
        { width: 2556, height: 1179, orientation: 'landscape' },
        { width: 1284, height: 2778, orientation: 'portrait' },
        { width: 2778, height: 1284, orientation: 'landscape' },
        { width: 1170, height: 2532, orientation: 'portrait' },
        { width: 2532, height: 1170, orientation: 'landscape' },
        { width: 1125, height: 2436, orientation: 'portrait' },
        { width: 2436, height: 1125, orientation: 'landscape' },
        { width: 1242, height: 2688, orientation: 'portrait' },
        { width: 2688, height: 1242, orientation: 'landscape' },
        { width: 828, height: 1792, orientation: 'portrait' },
        { width: 1792, height: 828, orientation: 'landscape' },
        { width: 1242, height: 2208, orientation: 'portrait' },
        { width: 2208, height: 1242, orientation: 'landscape' },
        { width: 750, height: 1334, orientation: 'portrait' },
        { width: 1334, height: 750, orientation: 'landscape' },
        { width: 640, height: 1136, orientation: 'portrait' },
        { width: 1136, height: 640, orientation: 'landscape' },
      ].map(({ width, height, orientation }) => (
        <link
          key={`${width}-${height}-${orientation}`}
          rel='apple-touch-startup-image'
          href={asset(`/img/gen/apple-splash-${width}-${height}.jpg`)}
          media={`(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: 2) and (orientation: ${orientation})`}
        />
      ))}
    </>
  );
}
