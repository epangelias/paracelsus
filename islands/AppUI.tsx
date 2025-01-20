import ChatBox from '@/islands/ChatBox.tsx';
import { ChatData } from '@/app/types.ts';

export function AppUI({ chatData }: { chatData: ChatData }) {
  return (
    <>
      <ChatBox data={chatData} />
    </>
  );
}
