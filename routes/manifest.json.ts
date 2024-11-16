import { define } from '@/lib/utils.ts';
import { site } from "@/lib/site.ts";
import icons from "@/static/AppImages/icons.json"  with { type: "json" };

export const handler = define.handlers(() => {
  return Response.json({
    name: site.name,
    short_name: site.name,
    id: site.name.toLowerCase(),
    start_url: '/',
    lang: site.lang,
    theme_color: site.themeColor,
    display: 'standalone',
    description: site.description,
    icons: [
      {
        src: site.favicon,
        sizes: 'any',
      },
      ...icons.icons.map(icon => ({ ...icon, src: "/AppImages/" + icon.src }))
    ],
  });
});
