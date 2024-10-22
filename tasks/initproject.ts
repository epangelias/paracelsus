#!/usr/bin/env -S deno run -A

const projectName = Deno.args[0] || prompt("Enter project name") ||
    "fresh-project";

const exec = async (args: string[]) =>
    await new Deno.Command(args[0], { args: args.slice(1) }).output();

await exec([
    "git",
    "clone",
    "https://github.com/epangelias/fresh-tempalte.git",
    projectName,
]);

Deno.chdir(projectName);

await exec(["deno", "task", "init"]);
