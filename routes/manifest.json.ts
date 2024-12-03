import { define } from '@/lib/utils.ts';
import { site } from '../app/site.ts';
import { asset } from 'fresh/runtime';
import icons from '@/static/img/gen/icons.json' with { type: 'json' };

export const handler = define.handlers(() => {
  return Response.json({
    name: site.name,
    short_name: site.name,
    id: site.name.toLowerCase(),
    start_url: '/',
    lang: site.lang,
    theme_color: site.themeColor,
    background_color: site.backgroundColor,
    display: 'standalone',
    description: site.description,
    handle_links: 'preferred',
    launch_handler: { 'client_mode': 'focus-existing' },
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'any',
    icons,
    screenshots: [
      { src: asset('/img/screenshot.jpg'), form_factor: 'wide' },
    ],
  });
});
