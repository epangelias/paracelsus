import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData } from '@/app/types.ts';
import { useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/stream/stream-client.ts';
import { usePWA } from '@/lib/pwa/usePWA.ts';
import { passGlobalData } from '@/lib/passGlobalData.ts';

interface Props {
  children: ComponentChildren;
  data: ReturnType<typeof passGlobalData>;
}

export function Global({ children, data: { user, mailEnabled, stripeEnabled, pushEnabled } }: Props) {
  const global: GlobalData = {
    user: useSignal(user),
    pwa: usePWA(),
    mailEnabled,
    stripeEnabled,
    pushEnabled,
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
