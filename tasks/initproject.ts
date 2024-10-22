#!/usr/bin/env -S deno run -A

const projectName = Deno.args[0] ||
    prompt("Enter Project Name [fresh-project]") ||
    "fresh-project";

const exec = async (args: string[]) =>
    await new Deno.Command(args[0], {
        args: args.slice(1),
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    })
        .output();

await exec([
    "git",
    "clone",
    "https://github.com/epangelias/fresh-tempalte.git",
    projectName,
]);

Deno.chdir(projectName);

await exec(["deno", "task", "init", projectName]);
await exec(["deno", "task", "update"]);
