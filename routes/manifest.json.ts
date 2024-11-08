import { define } from '@/lib/utils.ts';
import { siteData } from '@/lib/siteData.ts';
import { emojiOrFaviconToUrl } from '@/components/Favicon.tsx';

export const handler = define.handlers(ctx => {
    return Response.json({
        name: siteData.name,
        start_url: "/",
        lang: siteData.lang,
        theme_color: siteData.themeColor,
        display: "standalone",
        description: siteData.description,
        icons: [
            {
                src: emojiOrFaviconToUrl(siteData.favicon),
                sizes: "any",
            }
        ]
    })
})