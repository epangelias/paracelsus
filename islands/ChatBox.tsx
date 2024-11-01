import { useSignal } from '@preact/signals';
import { watchData } from '../lib/watch-data.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';

export default function ChatBox({ data }: { data: ChatData }) {
  const chatData = useSignal<ChatData>(data);

  const sendTrigger = watchData('/api/chat', chatData, {
    generation(trigger) {
      const lastMsg = chatData.value.messages.at(-1);
      lastMsg.content += trigger.value;
      chatData.value = { ...chatData.value };
    },
  });

  const inputText = useSignal('');

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    chatData.value.messages.push({ role: 'user', content: inputText.value, id: Date.now() });
    chatData.value.messages.push({ role: 'assistant', content: '', id: Date.now() });
    chatData.value = { ...chatData.value };
    inputText.value = '';
    await new Promise((resolve) => setTimeout(resolve, 500));
    sendTrigger('generate');
  }

  return (
    <div class='chat-box'>
      <div class='messages'>
        {chatData.value && chatData.value.messages.map((message: AIMessage) => (
          <div data-role={message.role}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <input
          type='text'
          value={inputText.value}
          onChange={(e) => inputText.value = (e.target as HTMLInputElement).value}
        />
        <button>Send</button>
      </form>
    </div>
  );
}
