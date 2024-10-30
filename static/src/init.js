let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

if (!colorSchemeMeta) {
    colorSchemeMeta = document.createElement('meta');
    colorSchemeMeta.setAttribute('name', 'color-scheme');
    document.head.appendChild(colorSchemeMeta);
}

const updateTheme = () => {
    const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

    const canDark = colorSchemeMeta.getAttribute('content').includes('dark');
    const canLight = colorSchemeMeta.getAttribute('content').includes('light') || !canDark;

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
