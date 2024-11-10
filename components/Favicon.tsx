import { Meth } from '@/lib/meth.ts';

export function Favicon({ icon = Meth.emojiToUrl('🤖') }) {
    return <link rel='icon' href={icon} />;
}
