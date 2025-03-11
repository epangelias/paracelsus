#!/usr/bin/env -S deno run -A

import { move } from 'jsr:@std/fs@1/move';
import { parseArgs } from 'jsr:@std/cli@1.0.9/parse-args';
import { Spinner } from 'jsr:@std/cli@1.0.9/unstable-spinner';
import { exists } from 'jsr:@std/fs@1/exists';
import { $, helpCLI, throwCLI } from '../lib/utils/cli.ts';
import { site } from '../app/site.ts';

const spinner = new Spinner({ color: 'green' });
const args = parseArgs(Deno.args);
const projectPath = args._[0] as string;
const projectName = projectPath?.split('/').pop();

if (args.help || args.h || projectPath === undefined) {
  helpCLI({
    name: 'paracelsus',
    description: 'A deno fresh webapp generator',
    usage: 'paracelsus <project-path>',
    options: [
      { flag: '-h, --help', usage: 'Show this help message' },
    ],
  });
  Deno.exit();
}

spinner.start();

const projectExists = await exists(projectPath);
if (projectExists) throwCLI(`Project already exists at ${projectPath}`);

spinner.message = `Cloning repository...`;

// Clone the repository
const cloned = await $('git', 'clone', 'https://github.com/epangelias/fresh-tempalte.git', projectPath);

if (!cloned.ok) throwCLI(`Failed to clone repository to "${projectPath}"`);

Deno.chdir(projectPath);

const siteData = {
  ...site,
  name: projectName,
  icon:
    'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>',
  description: 'A new project made with Paracelsus.',
  email: 'example@example.com',
};

// Create site.ts
const siteDataJSON = `export const site = ${JSON.stringify(siteData, null, 2)};`;

spinner.message = `Getting ready...`;

await Deno.writeTextFile('app/site.ts', siteDataJSON);

await move('.env.template', '.env');

await Deno.remove('tasks/paracelsus.ts');
await Deno.remove('README.md');
await Deno.remove('TODO.md');
await Deno.remove('.git', { recursive: true });
await Deno.remove('.github', { recursive: true });

spinner.message = `Updating project...`;
await $(Deno.execPath(), 'task', 'update');

spinner.message = `Generating assets...`;

await $(Deno.execPath(), 'task', 'generate');

spinner.stop();
