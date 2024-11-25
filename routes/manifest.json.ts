/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Security issues: None found.

Performance issues: None found.

Code style issues: The code is generally well-formatted, but some lines are a bit long.

Best practices: Consider adding type annotations for the `handler` function and its return value.

Maintainability issues: The `handler` function is quite long and does a lot of work; consider breaking it down into smaller functions.

Readability issues: The object returned by the `handler` function has many properties; consider grouping related properties into sub-objects.

Refactoring suggestion: Consider using a separate function to create the object returned by the `handler` function, to improve readability and maintainability.

Let me know if you'd like me to elaborate on any of these points!
*/


import { define } from '@/lib/utils.ts';
import { site } from '@/lib/site.ts';
import { asset } from 'fresh/runtime';

export const handler = define.handlers(() => {
  return Response.json({
    name: site.name,
    short_name: site.name,
    id: site.name.toLowerCase(),
    start_url: '/',
    lang: site.lang,
    theme_color: site.themeColor,
    background_color: '#000000',
    display: 'standalone',
    description: site.description,
    handle_links: 'preferred',
    launch_handler: { 'client_mode': 'focus-existing' },
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'any',
    icons: [
      {
        src: site.favicon,
        sizes: 'any',
      },
    ],
    screenshots: [
      { src: asset(site.previewImage), form_factor: 'wide' },
    ],
  });
});
