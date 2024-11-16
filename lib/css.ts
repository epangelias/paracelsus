import { site } from '@/lib/site.ts';

const CSSVariables: Record<string, string> = {
  ThemeColor: site.themeColor,
  AnyField:
    ':is(input:not([type]), input:is([type="text"], [type="password"], [type="email"], [type="number"], [type="url"], [type="tel"], [type="search"], [type="date"]), textarea)',
  AnyButton:
    ':is(button, input:is([type="button"], [type="submit"], [type="reset"], [type="file"], [type="color"]), select)',
};

function applyVariables(text: string) {
  for (const name in CSSVariables) {
    const value = CSSVariables[name];
    text = text.replaceAll(name, value);
  }
  return text;
}

export function resolveCssImports(filePath: string) {
  const folder = filePath.split('/').slice(0, -1).join('/');
  let css = Deno.readTextFileSync(filePath);
  const importPattern = /@import\s+["']([^"']+)["'];/g;
  const imports = [...css.matchAll(importPattern)];

  for (let imp of imports) {
    const importedFile = imp[1] as string;
    const fullImportPath = Deno.realPathSync(`${folder}/${importedFile}`);
    const importedCss = resolveCssImports(fullImportPath);
    css = css.replace(imp[0], importedCss);
  }

  return applyVariables(css);
}
