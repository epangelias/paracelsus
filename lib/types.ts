/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code appears to be well-organized and easy to read.
The use of interfaces and types helps to improve code maintainability and readability.
The naming conventions are consistent and follow best practices.

There are no apparent security issues in this code, as it seems to be purely a definition of types and interfaces.
No performance issues are evident, as this code does not perform any computations or operations.

However, it would be beneficial to consider adding documentation comments for each interface and type, explaining their purpose and usage.
Additionally, it might be helpful to separate these interfaces and types into different files or modules, if they are not closely related, to improve code organization and reusability.
*/


import type { Signal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { usePWA } from '@/lib/pwa.ts';

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

export type GlobalData = {
  user: Signal<Partial<UserData> | null | undefined>;
  outOfTokens: Signal<boolean>;
  pwa: ReturnType<typeof usePWA>;
};

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
