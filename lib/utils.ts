import { createDefine } from 'fresh';
import { User } from '@/lib/types.ts';

// deno-lint-ignore no-empty-interface
export interface State {
    user?: User;
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

const isEmoji = (text: string) => /\p{Emoji}/u.test(text);

export function emojiToUrl(icon: string) {
    return isEmoji(icon)
        ? `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${icon}</text></svg>`
        : icon;
}
