import { define } from '@/lib/utils.ts';
import { site } from '../lib/site.ts';
import { emojiOrFaviconToUrl } from '@/components/Favicon.tsx';

export const handler = define.handlers(ctx => {
    return Response.json({
        name: site.name,
        start_url: "/",
        lang: site.lang,
        theme_color: site.themeColor,
        display: "standalone",
        description: site.description,
        icons: [
            {
                src: emojiOrFaviconToUrl(site.favicon),
                sizes: "any",
            }
        ]
    })
})