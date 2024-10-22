#!/usr/bin/env -S deno run -A --watch=static/,routes/

// Initiate the Fresh Project

const path = (p: string) => import.meta.resolve("../") + p;

// Remove Github Repo
await Deno.remove(path(".git"), { recursive: true });

// Remove Init task
await Deno.remove(path("tasks/init.ts"));

// Remove task from deno.json
let denoJSON = await Deno.readTextFile(path("deno.json"));
denoJSON = denoJSON.split("\n").filter((line) =>
    !line.includes("deno run -A tasks/init.ts")
).join();
await Deno.writeTextFile(path("deno.json"), denoJSON);
