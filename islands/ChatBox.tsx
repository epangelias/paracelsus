import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE, watchSSE } from '../lib/sse.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { useEffect } from 'preact/hooks';

function insertLoader(html?: string) {
  return html?.replace(/<\/([^>]+)>\n+$/, `&nbsp;&nbsp;<span class="loader"></span></$1>`);
}

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
    generating.value = true;

    await sendSSE(endpoint, chatData.value);
    console.log(new Date());
    generateResponse();
  }

  function generateResponse() {
    const loader = '<span class="loader"></span>';

    const message: AIMessage = {
      role: 'assistant',
      content: '',
      html: loader,
    };

    chatData.value.messages.push(message);
    generating.value = true;

    watchSSE(`${endpoint}?ai=1`, (newMessage: AIMessage) => {
      if (newMessage == null) return generating.value = false;
      message.content = newMessage.content;
      message.html = insertLoader(newMessage.html);
      chatData.value = { ...chatData.value };
    });
  }

  return (
    <div class='chat-box'>
      <div class='messages'>
        {chatData.value.messages.map((message: AIMessage) => (
          <div
            data-role={message.role}
            dangerouslySetInnerHTML={message.html ? { __html: message.html } : undefined}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <input type='text' autofocus name='message' required autocomplete='off' />
        <button disabled={generating.value}>Send</button>
      </form>
    </div>
  );
}
