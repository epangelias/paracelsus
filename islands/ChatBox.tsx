import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE, watchSSE } from '../lib/sse.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { useEffect } from 'preact/hooks';

const endpoint = '/api/chat';

export default function ChatBox({ data }: { data: ChatData }) {
  const chatData = useSignal<ChatData>(data);
  const generating = useSignal(false);

  useEffect(() => syncSSE(endpoint, chatData), []);

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;

    chatData.value.messages.push({ role: 'user', content: input.value });
    chatData.value = { ...chatData.value };
    input.value = '';

    await sendSSE(endpoint, chatData.value);
    generateResponse();
  }

  function generateResponse() {
    const message = { role: 'assistant', content: '' };

    chatData.value.messages.push(message);
    generating.value = true;

    watchSSE(`${endpoint}?ai=1`, (token: string) => {
      if (token == null) return generating.value = false;

      message.content += token;
      chatData.value = { ...chatData.value };
    });
  }

  return (
    <div class='chat-box'>
      <div class='messages'>
        {chatData.value.messages.map((message: AIMessage) => (
          <div data-role={message.role}>{message.content}</div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <input type='text' autofocus name='message' required autocomplete='off' />
        <button disabled={generating.value}>Send</button>
      </form>
    </div>
  );
}
