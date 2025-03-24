import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/stream/stream-client.ts';
import { usePWA } from '@/lib/pwa/usePWA.ts';
import { createGlobalData } from '../lib/global-data.ts';
import { Signal } from '@preact/signals';
import { UserData } from '@/lib/user/user-data.ts';

export type GlobalData = {
  user: Signal<Partial<UserData> | null>;
  pwa: ReturnType<typeof usePWA>;
  mailEnabled: boolean;
  stripeEnabled: boolean;
  pushEnabled: boolean;
  authEnabled: boolean;
};

interface Props {
  children: ComponentChildren;
  data: ReturnType<typeof createGlobalData>;
}

export function Global({ children, data: { user, mailEnabled, stripeEnabled, pushEnabled, authEnabled } }: Props) {
  const global: GlobalData = {
    user: useSignal(user),
    pwa: usePWA(),
    mailEnabled,
    stripeEnabled,
    pushEnabled,
    authEnabled,
  };

  useEffect(() => {
    if (user) syncSSE('/api/userdata', { data: global.user });
  }, []);

  function unregisterPushWhenLoggedOut() {
    if (global.pwa.worker.value && global.pwa.pushSubscription.value && !global.user.value) {
      global.pwa.pushSubscription.value.unsubscribe();
    }
  }

  // THis hook seems to break the page and make it black each time updated for some reason
  // useEffect(unregisterPushWhenLoggedOut, [
  //   global.pwa.pushSubscription.value,
  //   global.user.value,
  //   // I think need to change this whole deal so that pwa has access to user and can do this there after loading worker
  //   // global.pwa.worker.value, // FIXME: Causes sign up page to blank
  // ]);

  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;
