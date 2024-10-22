#!/usr/bin/env -S deno run -A

import { exec } from '@/lib/utils.ts';

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

await exec(['deno', 'task', 'init', projectName]);
await exec(['deno', 'task', 'update']);
