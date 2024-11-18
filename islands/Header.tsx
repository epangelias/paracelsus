import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';
import { Meth } from '@/lib/meth.ts';
import { IS_BROWSER } from 'fresh/runtime';

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
            <span class='tokens'>
              ⚡️{global.value.user.isSubscribed ? '∞' : global.value.user.tokens}
            </span>
          )}

          {global?.value.user
            ? (
              <a href='/user'>
                {Meth.limitText(global?.value.user.name?.split(' ')[0], 15)}
              </a>
            )
            : <a href='/user/signin'>Sign In</a>}
        </div>
      </header>
      {promptVerify && (
        <div class='banner'>
          <a href='/user/resend-email'>Verify email</a> for more tokens
        </div>
      )}
      {promptSubscribe && (
        <div class='banner'>
          <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
        </div>
      )}
      {!promptVerify && !promptSubscribe && <PWA />}
    </>
  );
}

function PWA() {
  function isIOSSafari(): boolean {
    const userAgent = globalThis.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    return isIOS && isSafari;
  }

  function isPWA(): boolean {
    const isStandalone = globalThis?.matchMedia('(display-mode: standalone)').matches;
    const isPWAFromManifest = 'serviceWorker' in navigator && 'PushManager' in window;

    return isStandalone || isPWAFromManifest;
  }

  if (!IS_BROWSER || !isIOSSafari() || isPWA()) return <></>;

  return (
    <div class='banner'>
      You can <a href='/install-guide-ios'>install this app to your device</a>
    </div>
  );
}
