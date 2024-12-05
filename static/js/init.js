const updateTheme = () => {
  const colorScheme = document.querySelector('meta[name="color-scheme"]')?.getAttribute('content') || 'light';
  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  const hasDark = colorScheme?.includes('dark');
  const hasLight = colorScheme?.includes('light');
  const isDark = (hasDark && hasLight) ? prefersDark : hasDark;

  document.documentElement.classList.remove('theme-light', 'theme-dark');
  document.documentElement.classList.add(`theme-${isDark ? 'dark' : 'light'}`);
};

updateTheme();

globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

new MutationObserver(updateTheme).observe(
  document.querySelector('meta[name="color-scheme"]'),
  { attributes: true, attributeFilter: ['content'] },
);

// iOS active state
document.addEventListener('touchstart', () => {}, { passive: true });

// Hide placeholder banner depending on whether it was last up there
if (localStorage.getItem('hidePlaceholderBanner') === 'true') {
  document.documentElement.classList.add('hidePlaceholderBanner');
}

// Polyfill
if (!('anchorName' in document.documentElement.style)) {
  console.log('loading polyfill');
  import('https://unpkg.com/@oddbird/css-anchor-positioning');
}
