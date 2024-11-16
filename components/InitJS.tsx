const js = Deno.readTextFileSync(new URL('../static/init.js', import.meta.url));

export function InitJS() {
  return <script dangerouslySetInnerHTML={{ __html: js }}></script>;
}
