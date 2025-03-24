import { usePWA } from '@/lib/pwa/usePWA.ts';
import { Signal } from '@preact/signals';
import { AIMessage } from '../lib/oai.ts';
import { UserData } from '@/lib/user/user-data.ts';

export type GlobalData = {
  user: Signal<Partial<UserData> | null>;
  pwa: ReturnType<typeof usePWA>;
  mailEnabled: boolean;
  stripeEnabled: boolean;
  pushEnabled: boolean;
  authEnabled: boolean;
};

export interface State {
  user?: UserData;
  auth?: string;
  title?: string;
}

export interface ChatData {
  userId: string;
  messages: AIMessage[];
}
