import { createDefine } from 'fresh';
import { State } from '@/lib/types.ts';

export const define = createDefine<State>();
export const db = await Deno.openKv();
