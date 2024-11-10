import { emojiToUrl } from '@/lib/utils.ts';

export function Favicon({ icon = emojiToUrl('🤖') }) {
    return <link rel='icon' href={icon} />;
}
