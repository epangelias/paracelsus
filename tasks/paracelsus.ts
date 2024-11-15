#!/usr/bin/env -S deno run -A

import { exec, getParentDir } from '../lib/utils.ts';

const projectName = Deno.args[0] ||
    prompt('Enter Project Name [fresh-project]') ||
    'fresh-project';

await exec([
    'git',
    'clone',
    'https://github.com/epangelias/fresh-tempalte.git',
    projectName,
]);

Deno.chdir(projectName);

//
// Initial Project
//

const path = (p: string) => `${getParentDir(import.meta.dirname)}/${p}`;

// Remove Github Repo
await Deno.remove(path('.git'), { recursive: true });

// Set Site Data
const siteData = `export const site = {
    name: ${projectName},
    favicon: Meth.emojiToUrl("${prompt("Emoji Icon [🔥]") || "🔥"}"),
    themeColor: "#eb9a52",
    description: ${prompt("Project Description") || ""},
    email: "vaza@vaza.app",
    lang: "en-US"
};`
Deno.writeTextFile(path('lib/site.ts'), siteData);

// Remove Readme
await Deno.remove(path('README.md'));

// Remove Tasks
await Deno.remove(path('tasks/paracelsus.ts'));

// Open VSCODE
await exec([Deno.execPath(), 'task', 'open']);

await exec(['deno', 'task', 'update']);

await exec(['exit']);
