import { createDefine } from 'fresh';
import { UserData } from '@/lib/user/user-data.ts';

export interface State {
  user?: UserData;
  auth?: string;
  title?: string;
}

export const define = createDefine<State>();
export const db = await Deno.openKv();

export const isProductionMode = () => Deno.env.get('PROD') === 'true';

export const setProductionMode = (mode: boolean) => Deno.env.set('PROD', mode ? 'true' : 'false');
