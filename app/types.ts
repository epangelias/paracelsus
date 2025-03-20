import { ComponentChildren } from 'preact';
import { usePWA } from '@/lib/pwa/usePWA.ts';
import { Signal } from '@preact/signals';
import { AIMessage } from '@/lib/ai/oai.ts';

export interface BannerData {
  name: string;
  condition: () => boolean | undefined;
  canClose: boolean;
  content: () => ComponentChildren;
}

export interface UserData {
  id: string;
  created: number;
  email?: string | null;
  name: string;
  stripeCustomerId?: string;
  isSubscribed: boolean;
  hasSubscribed: boolean;
  tokens: number;
  pushSubscriptions: PushSubscription[];
}

export type GlobalData = {
  user: Signal<Partial<UserData> | null>;
  pwa: ReturnType<typeof usePWA>;
  mailEnabled: boolean;
  stripeEnabled: boolean;
  pushEnabled: boolean;
  oauthEnabled: boolean;
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
