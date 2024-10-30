import type { Signal } from '@preact/signals';
import { watchClient } from '../lib/watch-client.ts';
import { useEffect, useState } from 'preact/hooks';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const closeSocket = watchClient<{ count: number }>('/api/watch', (data) => setCount(data.count));
    return () => closeSocket();
  }, []);

  return (
    <div class='counter text-center'>
      <button onClick={() => fetch(`/api/set-count?count=${count - 1}`)}>- 1</button>{' '}
      <button onClick={() => fetch(`/api/set-count?count=${count + 1}`)}>+ 1</button>
      <h2>{count}</h2>
    </div>
  );
}
