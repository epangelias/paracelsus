import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, User } from '@/lib/types.ts';
import { Signal, useSignal } from '@preact/signals';
import { syncSSE } from '@/lib/sse.ts';

export function Global({ children, data }: { children: ComponentChildren; data: GlobalData }) {
    const signal = useSignal(data);

    useEffect(() => syncSSE('/api/global', signal), []);

    return (
        <>
            <GlobalContext.Provider value={signal}>
                {children}
            </GlobalContext.Provider>
        </>
    );
}

const GlobalContext = createContext<Signal<GlobalData> | null>(null);

export const useGlobal = () => useContext(GlobalContext) as Signal<GlobalData>;

export function createGlobalData(user?: User) {
    return {
        user: user && { name: user.name, tokens: user.tokens, isSubscribed: user.isSubscribed },
    };
}
