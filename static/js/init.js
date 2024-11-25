/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code is generally clean and well-organized, but there are a few areas for improvement.

The `updateTheme` function could be refactored to be more concise and efficient.

The use of `globalThis` is correct to ensure compatibility with different browsers.

The code does not have any apparent security issues.

The code does not have any apparent performance issues.

The code style is consistent and easy to follow.

Consider adding a check to ensure that `document.querySelector('meta[name="color-scheme"]')` returns a valid element before trying to access its attributes.

The usage of ` passive: true` in the `document.addEventListener` is good for performance.

The code has a good separation of concerns, with each function having a single responsibility.

The code is maintainable and readable.

It would be good to add some comments to explain what the code is doing, especially for less experienced developers.
*/


const updateTheme = () => {
  const colorScheme = document.querySelector('meta[name="color-scheme"]')?.getAttribute('content') || 'light';
  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  const hasDark = colorScheme?.includes('dark');
  const hasLight = colorScheme?.includes('light');
  const isDark = (hasDark && hasLight) ? prefersDark : hasDark;

  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${isDark ? 'dark' : 'light'}`);
};

function initTheme() {
  updateTheme();

  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

  new MutationObserver(updateTheme).observe(
    document.querySelector('meta[name="color-scheme"]'),
    { attributes: true, attributeFilter: ['content'] },
  );
}

initTheme();

// iOS active state
document.addEventListener('touchstart', () => {}, { passive: true });

// Page transition out
globalThis.addEventListener('beforeunload', () => document.body.classList.add('fade-out'));
