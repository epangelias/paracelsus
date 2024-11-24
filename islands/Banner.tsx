import { IS_BROWSER } from 'fresh/runtime';
import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { isIOSSafari } from '@/lib/pwa.ts';
import { useMemo } from 'preact/hooks';
import { BannerData } from '@/lib/types.ts';

export function Banners() {
  const global = useGlobal();

  if (!IS_BROWSER) return <></>;

  const banners: BannerData[] = [
    {
      name: 'verify-email',
      condition: () => !global.user.value?.hasVerifiedEmail && global.outOfTokens.value,
      canClose: false,
      content: () => (
        <>
          <a href='/user/resend-email'>Verify email</a> for more tokens
        </>
      ),
    },
    {
      name: 'subscribe',
      condition: () => global.user.value?.hasVerifiedEmail && global.outOfTokens.value,
      canClose: true,
      content: () => (
        <>
          <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
        </>
      ),
    },
    {
      name: 'ios-install',
      condition: () => !global.pwa.isPWA.value && isIOSSafari(),
      canClose: true,
      content: () => <a href='/install-guide-ios'>Install this app to your device</a>,
    },
    {
      name: 'pwa-install',
      condition: () => global.pwa.installPWA.value && !global.pwa.isPWA.value && !isIOSSafari(),
      canClose: true,
      content: () => <a href='#' onClick={global.pwa.installPWA.value}>Install this app to your device</a>,
    },
  ];

  const banner = useMemo(() => banners.find((b) => b.condition()), [
    global.pwa.installPWA.value,
    global.pwa.isPWA.value,
    global.outOfTokens.value,
    global.pwa.pushSubscription.value,
    global.pwa.worker.value,
    global.user.value,
  ]);

  if (!banner) return <></>;

  return <Banner data={banner} />;
}

export function Banner(
  { data: { name, canClose, content } }: { data: BannerData },
) {
  const hideBanner = useSignal(!!localStorage.getItem('hideBanner-' + name));

  function onClose() {
    localStorage.setItem('hideBanner-' + name, '1');
    hideBanner.value = true;
  }

  function onOpen() {
    localStorage.removeItem('hideBanner-' + name);
    hideBanner.value = false;
  }

  return (
    <>
      <button
        class='banner-button'
        onClick={onOpen}
        data-hide={!hideBanner.value}
        aria-label='Open Banner'
      >
        <span>!</span>
      </button>
      <div class='banner' role='status' aria-live='polite' data-hide={hideBanner.value}>
        {content()}
        {canClose && <button onClick={onClose} aria-label='Close'>×</button>}
      </div>
    </>
  );
}
