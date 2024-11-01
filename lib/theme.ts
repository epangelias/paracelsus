



export function setColorScheme(theme: string) {
    document.querySelector('meta[name="color-scheme"]')
        ?.setAttribute("content", theme);
}

export function saveColorScheme(theme: string) {
    setColorScheme(theme);
    localStorage.setItem("color-scheme", theme || "light dark");
}

export function getColorScheme() {
    const colorScheme = document.querySelector('meta[name="color-scheme"]')
        ?.getAttribute("content") || "";

    const isDark = colorScheme.includes("dark");
    const isLight = colorScheme.includes("light");
    const isAutomatic = isDark && isLight;
    const isSaved = !!localStorage.getItem("color-scheme");

    return { isDark, isLight, isAutomatic, isSaved }
}