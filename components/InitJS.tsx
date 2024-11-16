const js = Deno.readTextFileSync(import.meta.resolve('../static/init.js').slice(8));

export function InitJS() {
  return <script dangerouslySetInnerHTML={{ __html: js }}></script>;
}
