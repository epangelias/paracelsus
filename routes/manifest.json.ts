import { define } from '@/lib/utils.ts';
import { site } from '../lib/site.ts';

export const handler = define.handlers(() => {
    return Response.json({
        name: site.name,
        start_url: "/",
        lang: site.lang,
        theme_color: site.themeColor,
        display: "standalone",
        description: site.description,
        icons: [
            {
                src: site.favicon,
                sizes: "any",
            }
        ]
    })
})