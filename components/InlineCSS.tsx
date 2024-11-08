function resolveCssImports(filePath: string) {
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

    return css;
}

const css = resolveCssImports(import.meta.resolve('../static/css/main.css').slice(7));

export function InlineCSS() {
    return <style dangerouslySetInnerHTML={{ __html: css }}></style>;
}
