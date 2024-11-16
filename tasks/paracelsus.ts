#!/usr/bin/env -S deno run -A

export const exec = async (args: string[]) =>
  await new Deno.Command(args[0], {
    args: args.slice(1),
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  })
    .output();

const projectName = Deno.args[0] ||
  prompt('Enter Project Name [fresh-project]') ||
  'fresh-project';

await exec([
  'git',
  'clone',
  'https://github.com/epangelias/fresh-tempalte.git',
  projectName,
]);

//
// Initial Project
//

Deno.chdir(projectName);

const getPath = (path: string) => `${Deno.cwd()}/${path}`;

// Remove Github Repo
await Deno.remove(getPath('.git'), { recursive: true });

// Set Site Data
const siteData = `export const site = {
    name: ${projectName},
    favicon: Meth.emojiToUrl("${prompt('Emoji Icon [🔥]') || '🔥'}"),
    themeColor: "#eb9a52",
    description: ${prompt('Project Description') || ''},
    email: "vaza@vaza.app",
    lang: "en-US"
};`;
Deno.writeTextFile(getPath('lib/site.ts'), siteData);

// Remove Readme
await Deno.remove(getPath('README.md'));

// Remove Tasks
await Deno.remove(getPath('tasks/paracelsus.ts'));

// .env
await Deno.writeTextFile(getPath(".env"), "");

// Open VSCODE
await exec([Deno.execPath(), 'task', 'open']);

await exec(['deno', 'task', 'update']);

await exec(['exit']);
