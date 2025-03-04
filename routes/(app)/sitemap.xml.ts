import { define } from '@/lib/utils/utils.ts';
import { site } from '@/app/site.ts';

let sitemapCache: string = '';

async function getSitemap() {
  if (!sitemapCache) {
    const dirs = await Array.fromAsync(Deno.readDir('./pages'));

    sitemapCache = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${site.baseURL}</loc></url>
<url><loc>${site.baseURL}/user/pricing</loc></url>
${dirs.map((dir) => `<url><loc>${site.baseURL}/${dir.name.replace(/\.md$/, '')}</loc></url>`).join('\n')}
</urlset>`;
  }

  return new Response(sitemapCache, { headers: { 'Content-Type': 'application/xml' } });
}

export const handler = define.handlers({ GET: getSitemap });
