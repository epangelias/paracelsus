#!/usr/bin/env -S deno run -A

const projectPath = Deno.args[0];
if (!projectPath) throw new Error('No project path provided');

const projectName = projectPath.split('/').pop();

// Clone the repository
await new Deno.Command('git', {
  args: ['clone', 'https://github.com/epangelias/fresh-tempalte.git', projectPath],
  stdin: "inherit", stdout: "inherit", stderr: "inherit",
}).output();

Deno.chdir(projectPath);

// Create site.ts
const siteData = `import { Meth } from "@/lib/meth.ts";\n
export const site = {
  name: "${projectName}",
  icon: Meth.emojiToUrl('🔥'),
  themeColor: "#eb9a52",
  description: 'A new project made with Paracelsus.',
  email: "you@example.com",
  lang: "en-US"
};`;

await Deno.writeTextFile('app/site.ts', siteData);

// Copy .env.template to .env
const envTemplate = await Deno.readTextFile('.env.template');
await Deno.writeTextFile('.env', envTemplate);

// Remove unnecessary files and folders
await Deno.remove('.env.template');
await Deno.remove('tasks/paracelsus.ts');
await Deno.remove('README.md');
await Deno.remove('.git', { recursive: true });
await Deno.remove('.github', { recursive: true });

// Run the update task
await new Deno.Command('deno', {
  args: ['task', 'update'],
  stdin: "inherit", stdout: "inherit",
  // stderr: "inherit",
}).output();