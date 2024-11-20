import type { Signal } from '@preact/signals';

export interface CounterData {
  count: number;
}

export interface AIMessage {
  role: string;
  content: string;
  html?: string;
}

export interface ChatData {
  messages: AIMessage[];
}

export interface OAIOptions {
  baseURL?: string;
  apiKey: string;
  model: string;
}

export interface UserData {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  stripeCustomerId?: string;
  isSubscribed: boolean;
  tokens: number;
  isEmailVerified: boolean;
  hasVerifiedEmail: boolean;
  pushSubscriptions: PushSubscription[];
}

export interface GlobalData {
  user: Signal<Partial<UserData | null>>;
  worker?: ServiceWorkerRegistration | null;
  pushSubscription?: PushSubscription | null;
  requestSubscription: () => Promise<PushSubscription | null>;
}

export interface State {
  user?: UserData;
  auth?: string;
}
