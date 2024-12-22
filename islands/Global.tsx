import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/app/types.ts';
import { useComputed, useSignal } from '@preact/signals';
import { syncSSE } from '../lib/stream/stream-client.ts';
import { usePWA } from '../lib/pwa/usePWA.ts';

interface Props {
  children: ComponentChildren;
  user?: Partial<UserData>;
  mailEnabled: boolean;
  stripeEnabled: boolean;
  pushEnabled: boolean;
}
export function Global({ children, user, mailEnabled, stripeEnabled, pushEnabled }: Props) {
  const global: GlobalData = {
    user: useSignal(user),
    outOfTokens: useComputed(() => global.user.value?.tokens! <= 0 && !global.user.value?.isSubscribed),
    pwa: usePWA(),
    mailEnabled,
    stripeEnabled,
    pushEnabled,
  };

  // Synchronize user data with server
  if (user) useEffect(() => syncSSE('/api/userdata', { data: global.user }), []);

  // Unregister push when logged out
  useEffect(() => {
    if (!global.pwa.worker.value) return;
    if (global.pwa.pushSubscription.value && !global.user.value) {
      console.log('Unsubscribing push notifications logout');
      global.pwa.pushSubscription.value.unsubscribe();
    }
  }, [global.pwa.pushSubscription.value, global.user.value, global.pwa.worker.value]);

  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;
