#!/usr/bin/env -S deno run -A

import { exec, getParentDir } from '@/lib/utils.ts';

Deno.chdir(getParentDir(import.meta.dirname));

await exec(['code', '.']);

// Run synchronously
exec([Deno.execPath(), '-A', 'tasks/dev.ts']);

// Wait to launch page in browser until loaded
await new Promise((resolve) => setTimeout(resolve, 500));

// Open Browser page
if (Deno.build.os == 'linux') {
    await exec(['xdg-open', 'http://0.0.0.0:8000/']);
} else if (Deno.build.os == 'darwin') {
    await exec(['open', 'http://0.0.0.0:8000/']);
}
