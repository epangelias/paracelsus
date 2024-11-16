import { App } from 'fresh';
import { State } from '@/lib/utils.ts';
import ChatBox from '@/islands/ChatBox.tsx';

export function UserMod(app: App<State>) {
    // app.island(new URL("../../islands/ChatBox.tsx", import.meta.url), "chatbox", ChatBox);
    app.mountApp
}