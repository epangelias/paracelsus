#!/usr/bin/env -S deno run -A

import { exec, getParentDir } from '@/lib/utils.ts';

Deno.chdir(getParentDir(import.meta.dirname));

await exec([Deno.execPath(), "task", "update"]);

const { success } = await exec(["git", "remote", "get-url", "template"]);

if (!success) await exec(["git", "remote", "add", "template", "https://github.com/epangelias/fresh-template.git"]);

await exec(["git", "fetch", "template"]);

await exec(["git", "merge", "template/main", "--allow-unrelated-histories", "--no-ff", "--no-edit", "--no-commit",]);

// Added this test line