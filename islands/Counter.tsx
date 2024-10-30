import type { Signal } from '@preact/signals';
import { watchClient } from '../lib/watch-client.ts';
import { useEffect } from 'preact/hooks';

export default function Counter({ count }: { count: Signal<number> }) {
  useEffect(() => {
    watchClient<{ count: number }>('/api/watch', ({ count: c }) => count && (count.value = c));
  }, []);

  function setCount(count: number) {
    fetch(`/api/set-count?count=${count}`);
  }

  return (
    <div class='counter text-center'>
      <button onClick={() => setCount(count.value - 1)}>- 1</button>
      <big>
        <code>{` ${count.value} `}</code>
      </big>
      <button onClick={() => setCount(count.value + 1)}>+ 1</button>
    </div>
  );
}
