import { IS_BROWSER } from 'fresh/runtime';
import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { BannerData, GlobalData } from '@/app/types.ts';
import { isIOSSafari } from '@/lib/pwa/usePWA.ts';

export function createBannerData(global: GlobalData): BannerData[] {
  return [
    {
      name: 'verify-email',
      condition: () => !global.user.value?.hasVerifiedEmail && global.outOfTokens.value && global.mailEnabled,
      canClose: false,
      content: () => (
        <>
          <a href='/user/resend-email'>Verify email</a> for more tokens
        </>
      ),
    },
    {
      name: 'subscribe',
      condition: () => global.user.value?.hasVerifiedEmail && global.outOfTokens.value && global.stripeEnabled,
      canClose: true,
      content: () => (
        <>
          <a href='/user/pricing'>Subscribe</a> for unlimited tokens
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
        <button class='link' onClick={global.pwa.installPWA.value}>
          Install this app to your device
        </button>
      ),
    },
  ];
}

export function Banners() {
  const global = useGlobal();
  const banner = useSignal<BannerData>();

  const banners = createBannerData(global);

  // This is to prevent banner jumping after pwa signals change
  const ready = useSignal(false);
  setTimeout(() => ready.value = true, 1000);

  useEffect(() => {
    const currentBanner = localStorage.getItem('currentBanner');
    if (currentBanner && !ready.value) {
      banner.value = banners.find((b) => b.name === currentBanner);
    } else if (ready.value) {
      banner.value = banners.find((b) => b.condition());
      if (banner.value) {
        localStorage.setItem('currentBanner', banner.value.name);
      } else {
        localStorage.removeItem('currentBanner');
      }
    }
  }, [
    global.pwa.installPWA.value,
    global.pwa.isPWA.value,
    global.outOfTokens.value,
    global.pwa.pushSubscription.value,
    global.pwa.worker.value,
    global.user.value,
    ready.value,
  ]);

  if (!banner.value || !IS_BROWSER) return <></>;

  return <Banner banner={banner.value} />;
}

function Banner(
  { banner }: { banner: BannerData },
) {
  if (!banner || !IS_BROWSER) return <></>;

  const hideBanner = useSignal(true);

  hideBanner.value = localStorage.getItem('hideBanner-' + banner.name) === 'true';

  function onClose(e: Event) {
    e.stopPropagation();
    localStorage.setItem('hideBanner-' + banner.name, 'true');
    hideBanner.value = true;
  }

  function onOpen() {
    localStorage.removeItem('hideBanner-' + banner.name);
    hideBanner.value = false;
  }

  return (
    <>
      <button
        class='banner-closed-button'
        onClick={onOpen}
        data-hide={!hideBanner.value}
        aria-label='Open Banner'
      >
        <span>!</span>
      </button>
      <div class='banner' role='status' aria-live='polite' data-hide={hideBanner.value}>
        {banner.content()}
        {banner.canClose && <button onClick={onClose} aria-label='Close' class='close'></button>}
      </div>
    </>
  );
}
