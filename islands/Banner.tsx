import { IS_BROWSER } from 'fresh/runtime';
import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

export function Banners() {
  const global = useGlobal();

  const outOfTokens = global.value.user?.tokens! <= 0 && !global.value.user?.isSubscribed;

  const installPWA = useSignal<() => {}>();

  useEffect(() => {
    globalThis.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();

      const deferredPrompt = e as Event & {
        prompt: () => {};
        userChoice: Promise<{ outcome: string }>;
      };

      installPWA.value = async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('User choice: ', choice);
      };
    });
  }, []);

  if (!IS_BROWSER) return <></>;
  if (!global.value.user?.hasVerifiedEmail && outOfTokens) {
    return (
      <Banner name='subscribe' canClose={false}>
        <a href='/user/resend-email'>Verify email</a> for more tokens
      </Banner>
    );
  } else if (global.value.user?.hasVerifiedEmail && outOfTokens) {
    return (
      <Banner name='subscribe' canClose={false}>
        <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
      </Banner>
    );
  } else if (!isPWA()) {
    if (isIOSSafari()) {
      return (
        <Banner name='ios-install'>
          <a href='/install-guide-ios'>Install this app to your device</a>
        </Banner>
      );
    } else if (installPWA.value) {
      return (
        <Banner name='ios-install'>
          <a href='#' onClick={installPWA.value}>Install this app to your device</a>
        </Banner>
      );
    } else if (true) {
      return (
        <Banner name='notifications'>
          <a
            onClick={() => (globalThis as unknown as { testPush: () => {} }).testPush()}
            href='javascript:void'
          >
            Turn on Notifications
          </a>
        </Banner>
      );
    }
  }
  return <></>;
}

export function Banner(
  { children, name, canClose = true }: {
    children: ComponentChildren;
    name: string;
    canClose?: boolean;
  },
) {
  const hideBanner = useSignal(!!localStorage.getItem('hideBanner-' + name));

  if (hideBanner.value) return <></>;

  function onClose() {
    localStorage.setItem('hideBanner-' + name, '1');
    hideBanner.value = true;
  }

  return (
    <div class='banner' role='status' aria-live='polite'>
      {children}
      {canClose && <button onClick={onClose} aria-label='Close'>×</button>}
    </div>
  );
}

function isIOSSafari(): boolean {
  const userAgent = globalThis.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  return isIOS && isSafari;
}

function isPWA(): boolean {
  if (IS_BROWSER) return false;
  return globalThis?.matchMedia('(display-mode: standalone)').matches;
}
