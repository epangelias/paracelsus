import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';

export function Header() {
    const global = useGlobal();

    const promptVerify = !global.value.user?.hasVerifiedEmail &&
        global.value.user?.tokens! <= 0 && !global.value.user?.isSubscribed;
    const promptSubscribe = !promptVerify && global.value.user?.tokens! <= 0 &&
        !global.value.user?.isSubscribed;

    return (
        <>
            <header>
                <div className='left'>
                    <a href='/' class='color-primary logo'>
                        <img
                            src={site.favicon}
                            width={48}
                            height={48}
                            alt=''
                        />
                        <span>{site.name}</span>
                    </a>
                </div>
                <div className='right'>
                    {global?.value.user && (
                        <span class='spacing-right'>
                            ⚡️{global.value.user.isSubscribed ? '∞' : global.value.user.tokens}
                        </span>
                    )}

                    {global?.value.user
                        ? <a href='/user'>{global?.value.user.name}</a>
                        : <a href='/user/signin'>Sign In</a>}
                </div>
            </header>
            {promptVerify && (
                <div class='banner spacing-right'>
                    <a href='/user/resend-email'>Verify email</a> for more tokens
                </div>
            )}
            {promptSubscribe && (
                <div class='banner spacing-right'>
                    <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
                </div>
            )}
        </>
    );
}
