import * as Color from 'jsr:@std/fmt/colors';
import * as Path from 'jsr:@std/path@1';

function errorCLI(message: string) {
  console.error(`${Color.red(Color.bold('error'))}: ${message}`);
}

export function throwCLI(message: string) {
  errorCLI(message);
  Deno.exit(1);
}

export function helpCLI(options: {
  name: string;
  description?: string;
  usage?: string;
  options?: {
    flag: string;
    usage?: string;
  }[];
}) {
  const helpMessage = `
${Color.green(options.name)}${options.description ? `: ${options.description}` : ''}

${options.usage ? Color.blue('Usage: ') + options.usage : ''}

${options.options
      ? Color.blue('Options:\n') +
      options.options.map((opt) => `  ${opt.flag}\t${opt.usage || ''}`)
      : ''
    }
`;

  console.log(helpMessage);
}

export async function $(...args: string[]) {
  const cmd = new Deno.Command(args[0], {
    args: args.slice(1),
    stderr: 'piped',
    stdout: 'piped',
  });

  const output = await cmd.output();

  if (!output.success) {
    const error = new TextDecoder().decode(output.stderr);
    errorCLI(`${args.join(' ')} failed with error: ${error.split('\n').map((l) => '  ' + l).join('\n')}`);
    return { error, ok: false };
  } else {
    const result = new TextDecoder().decode(output.stdout);
    return { result, ok: true };
  }
}


export async function URLtoPath(url: string) {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type')?.split('/')[1].split('+')[0];
  const filePath = Path.join(import.meta.dirname!, `../static/img/gen/icon.${contentType}`);
  const imageData = new Uint8Array(await res.arrayBuffer());
  await Deno.writeFile(filePath, imageData);
  return filePath;
}

export async function download(_path: string | URL) {
  const path = _path.toString();
  if (path.startsWith('http') || path.startsWith('https')) return await URLtoPath(path);
  else if (path.startsWith('/') || path.startsWith('file:')) return path;
  else return Path.join(Deno.cwd(), path);
}