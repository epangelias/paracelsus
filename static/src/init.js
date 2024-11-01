let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

if (!colorSchemeMeta) {
    colorSchemeMeta = document.createElement('meta');
    colorSchemeMeta.setAttribute('name', 'color-scheme');
    document.head.appendChild(colorSchemeMeta);
}

const updateTheme = () => {
    let colorScheme = colorSchemeMeta.getAttribute('content');
    if (localStorage.getItem('color-scheme')) colorScheme = localStorage.getItem('color-scheme');

    const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

    const canDark = colorScheme.includes('dark');
    const canLight = colorScheme.includes('light') || !canDark;

    const theme = canDark && (prefersDark || !canLight) ? 'dark' : 'light';

    colorSchemeMeta;

    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
};

updateTheme();

globalThis.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateTheme);

new MutationObserver(() => updateTheme())
    .observe(colorSchemeMeta, { attributes: true, attributeFilter: ['content'] });
