import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/app/types.ts';
import { useComputed, useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/stream-client.ts';
import { usePWA } from '../lib/usePWA.ts';

export function Global(
  { children, user }: { children: ComponentChildren; user?: Partial<UserData> },
) {
  const global: GlobalData = {
    user: useSignal(user),
    outOfTokens: useComputed(() => global.user.value?.tokens! <= 0 && !global.user.value?.isSubscribed),
    pwa: usePWA(),
  };

  // Synchronize user data with server
  if (user) useEffect(() => syncSSE('/api/userdata', { data: global.user }), []);

  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;
