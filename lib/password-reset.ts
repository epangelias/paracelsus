import { db } from '@/lib/utils.ts';
import { generateCode } from '@/lib/crypto.ts';
import { UserData } from '@/app/types.ts';
import { getUserById } from '@/lib/user-data.ts';

export async function generatePasswordResetCode(user: UserData) {
    const code = generateCode();
    await db.set(["passwordResets", code], { id: user.id }, { expireIn: 1000 * 60 * 60 }); // One hour
    return code;
}

export async function getUserByPasswordResetCode(code: string) {
    const res = await db.get<{ id: string }>(["passwordResets", code]);
    if (res.versionstamp == null) return null;
    return await getUserById(res.value.id);
}

export async function removePasswordResetCode(code: string) {
    await db.delete(["passwordResets", code]);
}