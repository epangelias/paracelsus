#!/usr/bin/env -S deno run -A

const projectName = Deno.args[0] || prompt("Enter Project Name");

// Initiate the Fresh Project

const path = (p: string) =>
    `${import.meta.dirname?.split("/").slice(0, -1).join("/")}/${p}`;

// Remove Github Repo
await Deno.remove(path(".git"), { recursive: true });

// Set Site Data
const siteData = {
    title: projectName,
    emojiFavicon: prompt("Enter Emoji Favicon [🤖]") || "🤖",
};
const text = `export const SiteData = ${JSON.stringify(siteData)};`;
Deno.writeTextFile(path("siteData.ts"), text);

// Remove Tasks
await Deno.remove(path("tasks/init.ts"));
await Deno.remove(path("tasks/initproject.ts"));

// Remove task from deno.json
const denoJSON = JSON.parse(await Deno.readTextFile(path("deno.json")));
delete denoJSON.tasks.init;
await Deno.writeTextFile(path("deno.json"), JSON.stringify(denoJSON, null, 2));
