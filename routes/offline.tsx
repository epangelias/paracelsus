/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Security issue: Using `dangerouslySetInnerHTML` can be a security risk if the CSS content is not properly sanitized.

Performance issue: Reading files synchronously using `Deno.readTextFile` can block the event loop and affect performance.

Code style issue: The import statements are not alphabetized, making it harder to read.

Best practice issue: It's better to handle errors when reading files instead of ignoring them.

Maintainability issue: The CSS content is tightly coupled with the component, making it hard to update or replace.

Refactoring suggestion: Consider using a CSS-in-JS solution or a bundler like esbuild to handle CSS files instead of reading them manually.

Readability issue: The variable name `CSS` is not descriptive and could be renamed to something more meaningful.

Let me know if you'd like me to elaborate on any of these points!
*/


import { define } from '@/lib/utils.ts';
import { Page } from '@/components/Page.tsx';

const CSS = await Deno.readTextFile('static/css/main.css') +
  await Deno.readTextFile('static/css/theme.css');

export default define.page(() => (
  <Page hideHeader={true} hideBanner={true}>
    <h1>Your Offline!</h1>
    <p>
      <a href='/'>Reload</a>
    </p>
    <style dangerouslySetInnerHTML={{ __html: CSS }}></style>
  </Page>
));
