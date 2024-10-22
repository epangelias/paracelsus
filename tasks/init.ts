#!/usr/bin/env -S deno run -A

const projectName = Deno.args[0] || prompt("Enter Project Name");

// Initiate the Fresh Project

const path = (p: string) =>
    `${import.meta.dirname?.split("/").slice(0, -1).join("/")}/${p}`;

const exec = async (args: string[]) =>
    await new Deno.Command(args[0], {
        args: args.slice(1),
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    })
        .output();

// Remove Github Repo
await Deno.remove(path(".git"), { recursive: true });

// Set Site Data
const siteData = {
    title: projectName,
    emojiFavicon: prompt("Enter Emoji Favicon [🤖]") || "🤖",
};
const text = `export const siteData = ${JSON.stringify(siteData, null, 2)};`;
Deno.writeTextFile(path("siteData.ts"), text);

// Remove Readme
await Deno.remove(path("README.md"));

// Remove Tasks
await Deno.remove(path("tasks/init.ts"));
await Deno.remove(path("tasks/initproject.ts"));

// Remove task from deno.json
const denoJSON = JSON.parse(await Deno.readTextFile(path("deno.json")));
delete denoJSON.tasks.init;
await Deno.writeTextFile(path("deno.json"), JSON.stringify(denoJSON, null, 2));

// Open VSCODE
await exec(["code", "."]);

// Open Browser page
if (Deno.build.os == "linux") {
    await exec(["xdg-open", "http://0.0.0.0:8000/"]);
} else if (Deno.build.os == "darwin") {
    await exec(["open", "http://0.0.0.0:8000/"]);
}

// Run Project
await exec([Deno.execPath(), "run", "dev.ts"]);
