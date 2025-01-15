import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE, watchSSE } from '../lib/stream/stream-client.ts';
import { AIMessage } from '@/lib/stream/types.ts';
import { useEffect, useRef } from 'preact/hooks';
import { useGlobal } from '@/islands/Global.tsx';
import { ChatData } from '@/app/types.ts';
import { showOutOfTokensDialog } from '@/islands/OutOfTokensDialog.tsx';
import { delay } from '@std/async/delay';
import IconSend from 'tabler-icons/send.tsx';

export default function ChatBox({ data }: { data: ChatData }) {
  const global = useGlobal();
  const chatData = useSignal<ChatData>(data);
  const generating = useSignal(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const checkCanGenerate = () => global.user.value && (global.user.value.tokens! > 0 || global.user.value.isSubscribed);

  if (!global.user.value) return <></>;

  useEffect(() => syncSSE('/api/chatdata', { data: chatData }), []);

  useEffect(() => {
    scrollToBottom();
  }, [chatData.value]);

  function addMessage(message: AIMessage) {
    chatData.value.messages.push(message);
    chatData.value = { ...chatData.value };
    return message;
  }

  async function scrollToBottom() {
    await delay(100);
    if (!messagesRef.current) return;
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    global.pwa.requestSubscription();

    if (!checkCanGenerate()) return showOutOfTokensDialog();
    if (!inputRef.current) return;

    generating.value = true;
    addMessage({ role: 'user', content: inputRef.current.value });
    inputRef.current.value = '';
    scrollToBottom();
    await sendSSE('/api/chatdata', chatData.value);
    generateResponse();
  }

  function generateResponse() {
    const message: AIMessage = addMessage({
      role: 'assistant',
      content: '',
      html: '<span class="loader"></span>',
    });

    generating.value = true;

    watchSSE('/api/ai', {
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

  function ChatMessage(message: AIMessage, key: number) {
    return (
      <div
        data-role={message.role}
        dangerouslySetInnerHTML={message.html ? { __html: message.html } : undefined}
        key={`message:${key}`}
      >
        {message.content}
      </div>
    );
  }

  return (
    <>
      <div class='chat-box'>
        <div class='messages' ref={messagesRef}>
          {chatData.value.messages.filter((m: AIMessage) => m.role !== 'system').map(ChatMessage)}
        </div>

        <form onSubmit={onSubmit}>
          <textarea rows={1} autocomplete='off' autofocus required ref={inputRef} aria-label='Type a message'>
          </textarea>
          <button disabled={generating.value}>
            <IconSend />
          </button>
        </form>
      </div>
    </>
  );
}
