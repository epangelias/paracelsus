#!/usr/bin/env -S deno run -A

import { move } from 'jsr:@std/fs@1/move';
import { parseArgs } from 'jsr:@std/cli@1.0.9/parse-args';
import { Spinner } from 'jsr:@std/cli@1.0.9/unstable-spinner';
import { exists } from 'jsr:@std/fs@1/exists';
import * as Color from 'jsr:@std/fmt/colors';

const spinner = new Spinner({ message: 'Loading...', color: 'green' });
const args = parseArgs(Deno.args);
const projectPath = args._[0] as string;
const projectName = projectPath?.split('/').pop();
const helpMessage = `
${Color.green('Paracelsus')}: A deno fresh webapp generator

${Color.blue('Usage:')} paracelsus <project-path>

${Color.blue('Options:')}
  -h, --help    Show this help message
`;

function error(message: string) {
  spinner.stop();
  console.error(`${Color.red(Color.bold('error'))}: ${message}`);
  Deno.exit(1);
}

if (args.help || args.h || projectPath === undefined) {
  console.log(helpMessage);
  Deno.exit();
}

spinner.start();

const projectExists = await exists(projectPath);
if (projectExists) error(`Project already exists at ${projectPath}`);

spinner.message = `Cloning repository...`;

// Clone the repository
const res = await new Deno.Command('git', {
  args: ['clone', 'https://github.com/epangelias/fresh-tempalte.git', projectPath],
  stderr: 'piped',
}).output();

if (!res.success) error(`Failed to clone repository to "${projectPath}"`);

Deno.chdir(projectPath);

// Create site.ts
const siteData = `import { Meth } from "@/lib/utils/meth.ts";\n
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

await move('.env.template', '.env');

await Deno.remove('tasks/paracelsus.ts');
await Deno.remove('README.md');
await Deno.remove('.git', { recursive: true });
await Deno.remove('.github', { recursive: true });

spinner.message = `Updating project...`;
await new Deno.Command(Deno.execPath(), { args: ['task', 'update'], stderr: 'piped' }).output();

spinner.message = `Generating assets...`;

await new Deno.Command(Deno.execPath(), { args: ['task', 'generate'], stderr: 'piped' }).output();

spinner.stop();
