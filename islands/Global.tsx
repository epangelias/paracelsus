import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/lib/types.ts';
import { useComputed, useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/sse.ts';
import { getSubscription, loadServiceWorker, requestSubscription, usePWA } from '@/lib/worker.ts';

export function Global(
  { children, user }: { children: ComponentChildren; user?: Partial<UserData> },
) {
  const global = createGlobal(user);
  if (user) useEffect(() => syncSSE('/api/userdata', global.user), []);
  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

export function createGlobal(user?: Partial<UserData>) {
  const { isPWA, installPWA } = usePWA();

  const global: GlobalData = {
    user: useSignal(user),
    requestSubscription: () =>
      global.pushSubscription.value = requestSubscription(global.worker.value),
    pushSubscription: useSignal(null),
    worker: useSignal(null),
    isPWA,
    installPWA,
    outOfTokens: useComputed(() =>
      global.user.value?.tokens! <= 0 && !global.user.value?.isSubscribed
    ),
  };

  useEffect(() => {
    (async () => {
      global.worker.value = await loadServiceWorker();
      global.pushSubscription.value = await getSubscription(global.worker.value);
    })();
  }, []);

  return global;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;

export function stripUserData(user?: UserData) {
  if (!user) return null;
  return {
    name: user.name,
    tokens: user.tokens,
    isSubscribed: user.isSubscribed,
    isEmailVerified: user.isEmailVerified,
    email: user.email,
    hasVerifiedEmail: user.hasVerifiedEmail,
  } as Partial<UserData>;
}
