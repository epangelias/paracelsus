import { IS_BROWSER } from 'fresh/runtime';
import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { isIOSSafari } from '@/lib/pwa.ts';
import { useEffect, useMemo } from 'preact/hooks';
import { BannerData } from '@/app/types.ts';

export function Banners() {
  const global = useGlobal();
  const banner = useSignal<BannerData>();

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
      content: () => (
        <a href='javascript:void(0);' onClick={global.pwa.installPWA.value}>
          Install this app to your device
        </a>
      ),
    },
    {
      name: 'notifications',
      condition: () =>
        Notification.permission === 'default' && !global.pwa.pushSubscription.value && global.pwa.isPWA.value &&
        global.user.value,
      canClose: true,
      content: () => <a href='javascript:void(0);' onClick={global.pwa.requestSubscription}>Enable Notifications</a>,
    },
  ];

  // Delay until rendered after placeholder banner
  // This is to prevent banner jumping after pwa signals change
  const ready = useSignal(false);
  setTimeout(() => ready.value = true, 500);

  useEffect(() => {
    banner.value = banners.find((b) => b.condition());
  }, [
    global.pwa.installPWA.value,
    global.pwa.isPWA.value,
    global.outOfTokens.value,
    global.pwa.pushSubscription.value,
    global.pwa.worker.value,
    global.user.value,
    ready.value,
  ]);

  if (!IS_BROWSER || !ready.value) return <div class='banner placeholder' style={{ color: 'transparent' }}>x</div>;

  if (!banner.value) {
    localStorage.setItem('hidePlaceholderBanner', 'true');
    return <></>;
  }

  return <Banner data={banner.value} />;
}

export function Banner(
  { data: { name, canClose, content } }: { data: BannerData },
) {
  const hideBanner = useSignal(true);

  hideBanner.value = localStorage.getItem('hideBanner-' + name) === 'true';

  function onClose(e: Event) {
    e.stopPropagation();
    localStorage.setItem('hideBanner-' + name, 'true');
    hideBanner.value = true;
  }

  function onOpen() {
    localStorage.removeItem('hideBanner-' + name);
    hideBanner.value = false;
  }

  useEffect(
    () => localStorage.setItem('hidePlaceholderBanner', hideBanner.value ? 'true' : 'false'),
    [hideBanner.value],
  );

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
