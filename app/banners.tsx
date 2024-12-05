import { GlobalData } from '@/app/types.ts';
import { isIOSSafari } from '../lib/usePWA.ts';

export function createBannerData(global: GlobalData) {
  return [
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
}
