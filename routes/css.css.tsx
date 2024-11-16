import { define } from '@/lib/utils.ts';
import { resolveCssImports } from '@/lib/css.ts';

const css = resolveCssImports(import.meta.resolve('../static/css/main.css').slice(7));

export const handler = define.handlers({
  GET: (_ctx) => {
    return new Response(css, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  },
});
