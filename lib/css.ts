import { walk } from 'jsr:@std/fs@1/walk';



export async function compileCSS() {
  let css = '';

  for await (const file of walk(new URL(import.meta.resolve("../static/css/")))) {
    if (file.isDirectory) continue;
    const text = await Deno.readTextFile(file.path);
    console.log(file.path);
    css += text + "\n";
  }

  await Deno.writeTextFile(new URL(import.meta.resolve('../static/css/css.css')), css);
}