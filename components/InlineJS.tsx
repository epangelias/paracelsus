const js = Deno.readTextFileSync(import.meta.resolve('../static/src/init.js').slice(7));

export function InlineJS() {
    return <script dangerouslySetInnerHTML={{ __html: js }}></script>;
}
