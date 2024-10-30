import { useSignal } from '@preact/signals';
import { watchData } from '../lib/watch-data.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';

export default function ChatBox() {
  const chatData = useSignal<ChatData>({ messages: [] });

  watchData('/api/chat', chatData);

  const inputText = useSignal('');

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    chatData.value.messages.push({ role: 'user', content: inputText.value, id: Date.now() });
    chatData.value = { ...chatData.value };
    inputText.value = '';
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
