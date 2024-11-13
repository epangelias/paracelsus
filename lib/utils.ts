import { createDefine } from 'fresh';
import { UserData } from '@/lib/types.ts';

// deno-lint-ignore no-empty-interface
export interface State {
    user?: UserData;
    auth?: string;
}

export const define = createDefine<State>();

export const exec = async (args: string[]) =>
    await new Deno.Command(args[0], {
        args: args.slice(1),
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit',
    })
        .output();

export const getParentDir = (path?: string) => {
    if (!path) return "";
    return path.split('/').slice(0, -1).join('/') as string;
};