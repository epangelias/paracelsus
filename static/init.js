let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

if (!colorSchemeMeta) {
  colorSchemeMeta = document.createElement('meta');
  colorSchemeMeta.setAttribute('name', 'color-scheme');
  document.head.appendChild(colorSchemeMeta);
}

if (localStorage.getItem('color-scheme')) {
  colorSchemeMeta.setAttribute('content', localStorage.getItem('color-scheme'));
}

const updateTheme = () => {
  const colorScheme = localStorage.getItem('color-scheme') ||
    colorSchemeMeta.getAttribute('content');

  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

  const canDark = colorScheme.includes('dark');
  const canLight = colorScheme.includes('light') || !canDark;

  const theme = canDark && (prefersDark || !canLight) ? 'dark' : 'light';

  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
};

updateTheme();

globalThis.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', updateTheme);

new MutationObserver(() => updateTheme())
  .observe(colorSchemeMeta, { attributes: true, attributeFilter: ['content'] });
