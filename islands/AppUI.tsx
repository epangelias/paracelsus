import ChatBox from '@/islands/ChatBox.tsx';
import { OutOfTokensDialog } from '@/islands/OutOfTokensDialog.tsx';
import { ChatData } from '@/app/chat-data.ts';

export function AppUI({ chatData }: { chatData: ChatData }) {
  return (
    <>
      <ChatBox data={chatData} />
      <OutOfTokensDialog />
    </>
  );
}
