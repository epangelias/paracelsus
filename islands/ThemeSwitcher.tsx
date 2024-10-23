import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

type Theme = 'light' | 'dark' | undefined;

export function ThemeSwitcher({ theme = useSignal<Theme>() }) {
    const updateTheme = () => {
        theme.value = globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.body.classList.remove('theme-light', 'theme-dark');
        if (!theme.value) return;
        document.body.classList.add(`theme-${theme.value}`);
    };

    useEffect(() => {
        updateTheme();
        const mediaQueryList = globalThis.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addEventListener('change', updateTheme);
        return () => mediaQueryList.removeEventListener('change', updateTheme);
    }, [theme]);

    return <></>;
}
