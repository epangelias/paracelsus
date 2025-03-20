// Strip user data for sending to client

import { UserData } from '@/app/types.ts';
import { createUserData, deleteUserData } from '@/lib/user/user-data.ts';
import { db } from '@/lib/utils/utils.ts';
import { generateCode } from '@/lib/utils/crypto.ts';

export function stripUserData(user?: UserData) {
  if (!user) return null;
  // This is the user data sent to the client
  return {
    name: user.name,
    email: user.email,
    tokens: user.tokens,
    isSubscribed: user.isSubscribed,
    hasSubscribed: user.hasSubscribed,
  } as Partial<UserData>;
}

export function createUser(options: { id: string, name: string; email: string; isPremium: boolean }) {
  return createUserData({
    id: options.id,
    created: Date.now(),
    name: options.name,
    email: options.email,
    tokens: 5,
    isSubscribed: options.isPremium,
    hasSubscribed: options.isPremium,
    pushSubscriptions: [],
  });
}

export async function deleteUser(userId: string) {
  await db.delete(['chat', userId]);
  await deleteUserData(userId);
}
