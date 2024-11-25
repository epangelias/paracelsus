/* AI GENERATED COMMENT
Here is my feedback:

* The code appears to be well-structured and follows a consistent style.
* It's good to see that HTML attributes are not hardcoded, but instead, they're using variables from the `site` object.
* The use of `dangerouslySetInnerHTML` is generally discouraged due to security concerns, as it can lead to XSS vulnerabilities. Consider using a safer approach to inject CSS styles.
* The `stripUserData` function is not defined in this file, but it's good that it's being used to sanitize user data before passing it to the `Global` component.
* There's no apparent performance bottleneck in this code, but it's worth noting that the number of HTTP requests can be reduced by bundling or compressing CSS files.
* Consider adding type annotations for the `Component` and `state` props to improve code readability and maintainability.
* The `asset` function is not defined in this file, but it's good that it's being used to get the correct URL for assets. Make sure it's properly implemented to handle different environments and caching.
* The code can be refactored to extract repeating meta tags into a separate function or component to improve maintainability.
* Consider adding comments to explain the purpose of each section of the code, especially the `<head>` and `<body>` tags.

Overall, the code looks clean and well-maintained, but there are some potential security and performance concerns that should be addressed.
*/

import { site } from '@/lib/site.ts';
import { define } from '@/lib/utils.ts';
import { asset } from 'fresh/runtime';
import { stripUserData } from '@/lib/user-data.ts';
import { Global } from '@/islands/Global.tsx';

export default define.page(({ Component, state }) => {
  return (
    <html lang={site.lang}>
      <head>
        <title>{site.name}</title>
        <meta content={site.name} property='og:title'></meta>
        <meta content={site.description} name='description' />
        <meta content={site.description} property='og:description' />
        <meta content={asset(site.previewImage)} property='og:image' />
        <meta property='og:type' content='website' />

        <meta charset='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
        />
        <meta name='color-scheme' content='light dark' />
        <link rel='apple-touch-icon' href={asset(site.appIcon)} />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content={site.themeColor} />
        <meta name='format-detection' content='telephone=no' />
        <link rel='manifest' href={asset('/manifest.json')} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--primary: ${site.themeColor}` }}></style>
        <link rel='stylesheet' href={asset('/css/theme.css')} />
        <link rel='stylesheet' href={asset('/css/main.css')} />
        <link rel='stylesheet' href={asset('/css/components.css')} />
        <link rel='icon' href={asset(site.favicon)} />
      </head>
      <body>
        <Global user={stripUserData(state.user)}>
          <Component />
        </Global>

        <script src={asset('/js/init.js')}></script>
      </body>
    </html>
  );
});
