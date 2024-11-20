import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/lib/types.ts';
import { useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/sse.ts';
import { initJS } from '@/lib/init.ts';
import { loadServiceWorker, requestSubscription } from '@/lib/worker.ts';

export function Global(
  { children, user }: { children: ComponentChildren; user?: Partial<UserData> },
) {
  const global: GlobalData = {
    user: useSignal(user),
    requestSubscription: () => requestSubscription(global.worker),
  };

  if (user) useEffect(() => syncSSE('/api/global', global), []);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    initJS();

    global.worker = await loadServiceWorker();
    global.pushSubscription = await global.worker?.pushManager.getSubscription();
  }

  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;

export function createGlobalData(user?: UserData) {
  return {
    user: user &&
      {
        name: user.name,
        tokens: user.tokens,
        isSubscribed: user.isSubscribed,
        isEmailVerified: user.isEmailVerified,
        email: user.email,
        hasVerifiedEmail: user.hasVerifiedEmail,
      },
  };
}
