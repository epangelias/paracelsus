import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE, watchSSE } from '@/lib/sse.ts';
import { AIMessage, ChatData } from '@/lib/types.ts';
import { useEffect, useRef } from 'preact/hooks';
import { useGlobal } from '@/islands/Global.tsx';
import { Textarea } from '@/islands/Textarea.tsx';

const endpoint = '/api/chatdata';

export default function ChatBox({ data }: { data: ChatData }) {
  const global = useGlobal();
  const chatData = useSignal<ChatData>(data);
  const generating = useSignal(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const checkCanGenerate = () => global.user.value && (global.user.value.tokens >= 0 || global.user.value.isSubscribed);

  if (!global.user.value) return <></>;

  useEffect(() => syncSSE({ endpoint, data: chatData }), []);

  useEffect(() => {
    scrollToBottom();
  }, [chatData.value]);

  function addMessage(message: AIMessage) {
    chatData.value.messages.push(message);
    chatData.value = { ...chatData.value };
    return message;
  }

  async function scrollToBottom() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!messagesRef.current) return;
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!checkCanGenerate()) return alert('Your out of tokens now pay');
    if (!inputRef.current) return;

    generating.value = true;
    addMessage({ role: 'user', content: inputRef.current.value });
    inputRef.current.value = '';
    scrollToBottom();
    await sendSSE(endpoint, chatData.value);
    generateResponse();
  }

  function generateResponse() {
    const message: AIMessage = addMessage({
      role: 'assistant',
      content: '',
      html: '<span class="loader"></span>',
    });

    generating.value = true;

    watchSSE({
      endpoint: '/api/ai',
      onMessage(newMessage: AIMessage) {
        if (newMessage == null) return generating.value = false;
        message.content = newMessage.content;
        message.html = newMessage.html;
        chatData.value = { ...chatData.value };
        scrollToBottom();
      },
      onError() {
        message.html = '<p class="error-message" role="alert" aria-live="assertive">Error generating response</p>';
        generating.value = false;
      },
    });
  }

  function ChatMessage(message: AIMessage) {
    return (
      <div
        data-role={message.role}
        dangerouslySetInnerHTML={message.html ? { __html: message.html } : undefined}
      >
        {message.content}
      </div>
    );
  }

  return (
    <div class='chat-box'>
      <div class='messages' ref={messagesRef}>
        {chatData.value.messages.filter((m: AIMessage) => m.role !== 'system').map(ChatMessage)}
      </div>

      <form onSubmit={onSubmit}>
        <Textarea
          autofocus
          required
          inputRef={inputRef}
        />
        <button disabled={generating.value}>
          <span>◉</span>
        </button>
      </form>
    </div>
  );
}
