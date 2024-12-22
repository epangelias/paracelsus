import { createDefine } from 'fresh';
import { State } from '@/app/types.ts';

export const define = createDefine<State>();
export const db = await Deno.openKv();

export const isProduction = () => Deno.env.get('PROD') === 'true';

export const setProduction = (mode: boolean) => Deno.env.set('PROD', mode ? 'true' : 'false');
