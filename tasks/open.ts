#!/usr/bin/env -S deno run -A

Deno.chdir(import.meta.dirname?.split('/').slice(0, -1).join('/') as string)

const exec = async (args: string[]) =>
    await new Deno.Command(args[0], {
        args: args.slice(1),
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit',
    })
        .output()

await exec(['code', '.'])

// Run synchronously
exec([Deno.execPath(), '-A', 'tasks/dev.ts'])

// Wait to launch page in browser until loaded
await new Promise((resolve) => setTimeout(resolve, 500))

// Open Browser page
if (Deno.build.os == 'linux') {
    await exec(['xdg-open', 'http://0.0.0.0:8000/'])
} else if (Deno.build.os == 'darwin') {
    await exec(['open', 'http://0.0.0.0:8000/'])
}
