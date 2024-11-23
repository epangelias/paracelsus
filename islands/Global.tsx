import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/lib/types.ts';
import { useComputed, useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/sse.ts';
import { usePWA } from '@/lib/pwa.ts';

const endpoint = '/api/userdata';

export function Global(
  { children, user }: { children: ComponentChildren; user?: Partial<UserData> },
) {
  const global: GlobalData = {
    user: useSignal(user),
    outOfTokens: useComputed(() =>
      global.user.value?.tokens! <= 0 && !global.user.value?.isSubscribed
    ),
    ...usePWA(),
  };

  if (user) useEffect(() => syncSSE({ endpoint, data: global.user }), []);
  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
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
