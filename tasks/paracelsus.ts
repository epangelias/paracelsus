#!/usr/bin/env -S deno run -A

export const exec = async (args: string[]) =>
  await new Deno.Command(args[0], {
    args: args.slice(1),
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  }).output();

const projectPath = Deno.args[0];

if (!projectPath) throw new Error('No project path provided');

const projectName = projectPath.split("/")[-1];

await exec(['git', 'clone', 'https://github.com/epangelias/fresh-tempalte.git', projectPath]);

Deno.chdir(projectPath);

const getPath = (path: string) => Deno.cwd() + "/" + path;

console.log(getPath(""));

const siteData = `import { Meth } from "@/lib/meth.ts";\n
export const site = {
  name: "${projectName}",
  favicon: Meth.emojiToUrl("${prompt('Emoji Icon [🔥]') || '🔥'}"),
  appIcon: "/img/app.png",
  themeColor: "#eb9a52",
  description: "${prompt('Project Description') || ''}",
  email: "vaza@vaza.app",
  lang: "en-US"
};`;

Deno.writeTextFile(getPath('lib/site.ts'), siteData);

const envTemplate = await Deno.readTextFile(getPath('.env.template'));
await Deno.writeTextFile(getPath('.env'), envTemplate);

await Deno.remove(getPath('.env.template'));
await Deno.remove(getPath('tasks/paracelsus.ts'));
await Deno.remove(getPath('README.md'));
await Deno.remove(getPath('.git'), { recursive: true });
await Deno.remove(getPath('.github'), { recursive: true });

await exec(['deno', 'task', 'update']);
