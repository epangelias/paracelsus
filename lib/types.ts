import type { Signal } from '@preact/signals';
import { ComponentChildren } from 'preact';

export interface CounterData {
  count: number;
}

export interface AIMessage {
  role: string;
  content: string;
  html?: string;
}

export interface ChatData {
  userId: string;
  messages: AIMessage[];
}

export interface OAIOptions {
  baseURL?: string;
  apiKey: string;
  model: string;
}

export interface UserData {
  id: string;
  created: number;
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
  user: Signal<Partial<UserData> | null | undefined>;
  worker: Signal<ServiceWorkerRegistration | null>;
  pushSubscription: Signal<PushSubscription | null>;
  requestSubscription: () => Promise<PushSubscription | null>;
  isPWA: Signal<boolean>;
  installPWA: Signal<() => {} | null>;
  outOfTokens: Signal<boolean>;
}

export interface State {
  user?: UserData;
  auth?: string;
}

export interface MailOptions {
  fromName: string;
  toName: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface BannerData {
  name: string;
  condition: () => boolean | undefined;
  canClose: boolean;
  content: () => ComponentChildren;
}
