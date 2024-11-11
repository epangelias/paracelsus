#!/usr/bin/env -S deno run -A

import { exec, getParentDir } from '@/lib/utils.ts';

const projectName = Deno.args[0] || prompt('Enter Project Name');

// Initiate the Fresh Project

const path = (p: string) => `${getParentDir(import.meta.dirname)}/${p}`;

// Remove Github Repo
await Deno.remove(path('.git'), { recursive: true });

// Set Site Data
const siteData = {
    title: projectName,
    emojiFavicon: '🔥',
    themeColor: '#2596be',
};
const text = `export const siteData = ${JSON.stringify(siteData, null, 2)};`;
Deno.writeTextFile(path('lib/siteData.ts'), text);

// Remove Readme
await Deno.remove(path('README.md'));

// Remove Tasks
await Deno.remove(path('tasks/init.ts'));
await Deno.remove(path('tasks/paracelsus.ts'));

// Remove task from deno.json
const denoJSON = JSON.parse(await Deno.readTextFile(path('deno.json')));
delete denoJSON.tasks.init;
await Deno.writeTextFile(path('deno.json'), JSON.stringify(denoJSON, null, 2));

// Open VSCODE
await exec([Deno.execPath(), 'task', 'open']);
