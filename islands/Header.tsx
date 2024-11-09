import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';
import { emojiOrFaviconToUrl } from '@/components/Favicon.tsx';

export function Header() {
    const global = useGlobal();

    return (
        <header>
            <div className='left'>
                <a href='/'>
                    <img
                        src={emojiOrFaviconToUrl(site.favicon)}
                        width={32}
                        height={32}
                    />
                    {' ' + site.name}
                </a>
            </div>
            <div className='right'>
                {global?.value.user
                    ? <a href='/user'>{global?.value.user.name}</a>
                    : <a href='/user/signin'>Sign In</a>}
            </div>
        </header>
    );
}
