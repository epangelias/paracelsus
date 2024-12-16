#!/usr/bin/env -S deno run -A

import { move } from 'jsr:@std/fs@1/move';
import { parseArgs } from 'jsr:@std/cli/parse-args';
import { Spinner } from 'jsr:@std/cli/unstable-spinner';
import { exists } from 'jsr:@std/fs@1/exists';

const spinner = new Spinner({ message: 'Loading...' });

const args = parseArgs(Deno.args);

if (args.help || args.h) {
  console.log(`Usage: paracelsus <project-path>`);
  console.log(`Example: paracelsus ~/Projects/my-project`);

  Deno.exit();
}

spinner.start();

const projectPath = args._[0] as string;
if (!projectPath) throw new Error('No project path provided');

const projectName = projectPath.split('/').pop();

const projectExists = await exists(projectPath);
if (projectExists) throw new Error(`Project already exists at ${projectPath}`);

spinner.message = `Cloning repository...`;

// Clone the repository
await new Deno.Command('git', {
  args: ['clone', 'https://github.com/epangelias/fresh-tempalte.git', projectPath],
}).output();

const cloned = await exists(projectPath + '/.git');
if (!cloned) throw new Error(`Failed to clone repository to ${projectPath}`);

Deno.chdir(projectPath);

// Create site.ts
const siteData = `import { Meth } from "@/lib/meth.ts";\n
export const site = {
  name: "${projectName}",
  icon: Meth.emojiToUrl('🔥'),
  themeColor: "#eb9a52",
  backgroundColor: "#222222",
  description: 'A new project made with Paracelsus.',
  email: "you@example.com",
  lang: "en-US"
};`;

spinner.message = `Getting ready...`;

await Deno.writeTextFile('app/site.ts', siteData);

// Copy .env.template to .env
await move('.env.template', '.env');

// Remove unnecessary files and folders
await Deno.remove('tasks/paracelsus.ts');
await Deno.remove('README.md');
await Deno.remove('.git', { recursive: true });
await Deno.remove('.github', { recursive: true });

spinner.message = `Updating project...`;

// Run the update task
await new Deno.Command('deno', { args: ['task', 'update'] }).output();
