const isEmoji = (text: string) => /\p{Emoji}/u.test(text);

export function emojiOrFaviconToUrl(icon: string) {
    return isEmoji(icon)
        ? `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${icon}</text></svg>`
        : icon;
}

export function Favicon({ icon = '🤖' }) {
    return <link rel='icon' href={emojiOrFaviconToUrl(icon)} />;
}
