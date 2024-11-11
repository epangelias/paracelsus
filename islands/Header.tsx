import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';

export function Header() {
    const global = useGlobal();

    function TokenDisplay() {
        if (!global?.value.user) return <></>;

        const promptVerify = !global.value.user.hasVerifiedEmail &&
            global.value.user.tokens! <= 0 && !global.value.user.isSubscribed;
        const promptSubscribe = !promptVerify && global.value.user.tokens! <= 0 &&
            !global.value.user.isSubscribed;

        return (
            <span class='spacing-right'>
                {promptVerify && (
                    <span class='spacing-right'>
                        <a href='/user/resend-email'>Verify email</a> for more tokens
                    </span>
                )}
                {promptSubscribe && (
                    <span class='spacing-right'>
                        <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
                    </span>
                )}
                ⚡️{global?.value.user?.tokens}
            </span>
        );
    }

    return (
        <header>
            <div className='left'>
                <a href='/' class='color-primary logo'>
                    <img src={site.favicon} width={32} height={32} alt='' />
                    <span>{' ' + site.name}</span>
                </a>
            </div>
            <div className='right'>
                <TokenDisplay />

                {global?.value.user
                    ? <a href='/user'>{global?.value.user.name}</a>
                    : <a href='/user/signin'>Sign In</a>}
            </div>
        </header>
    );
}
