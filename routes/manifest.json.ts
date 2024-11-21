import { define } from '@/lib/utils.ts';
import { site } from '@/lib/site.ts';

export const handler = define.handlers(() => {
  return Response.json({
    name: site.name,
    short_name: site.name,
    id: site.name.toLowerCase(),
    start_url: '/',
    lang: site.lang,
    theme_color: site.themeColor,
    background_color: "#000000",
    display: 'standalone',
    description: site.description,
    handle_links: "preferred",
    launch_handler: { "client_mode": "focus-existing" },
    display_override: ["window-controls-overlay", "standalone", "browser"],
    orientation: "any",
    icons: [
      {
        src: site.favicon,
        sizes: 'any',
      },
    ],
    screenshots: [
      { src: "/img/screenshot-og.jpg", form_factor: "wide" },
    ],
  });
});
