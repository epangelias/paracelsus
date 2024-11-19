import { site } from '@/lib/site.ts';
import { App } from 'fresh';
import { State } from '@/lib/types.ts';

const CSSVariables: Record<string, string> = {
    ThemeColor: site.themeColor,
    anyfield:
        ':is(input:not([type]), input:is([type="text"], [type="password"], [type="email"], [type="number"], [type="url"], [type="tel"], [type="search"], [type="date"]), textarea)',
    anybutton:
        ':is(button, input:is([type="button"], [type="submit"], [type="reset"], [type="file"], [type="color"]), select)',
};

function applyVariables(text: string) {
    for (const name in CSSVariables) {
        const value = CSSVariables[name];
        text = text.replaceAll(name, value);
    }
    return text;
}

function resolveCssImports(filePath: URL) {
    const folder = new URL(filePath.href.split('/').slice(0, -1).join('/'));
    let css = Deno.readTextFileSync(filePath);
    const importPattern = /@import\s+["']([^"']+)["'];/g;
    const imports = [...css.matchAll(importPattern)];

    for (const imp of imports) {
        const importedFile = imp[1] as string;
        const fullImportPath = new URL(`${folder}/${importedFile}`);
        const importedCss = resolveCssImports(fullImportPath);
        css = css.replace(imp[0], importedCss);
    }

    return applyVariables(css);
}

export const SITE_CSS = resolveCssImports(new URL('./main.css', import.meta.url));

export function CSSMod(app: App<State>) {
    app.get("/css.css", () => new Response(SITE_CSS, { headers: { 'Content-Type': 'text/css' } }));
}