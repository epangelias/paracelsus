import type { Signal } from '@preact/signals';
import { watchClient } from '../lib/watch-client.ts';
import { useEffect, useState } from 'preact/hooks';

interface DataType {
  count: number;
}

export default function Counter() {
  const [data, setData] = useState<DataType | undefined>();

  useEffect(() => {
    const closeSocket = watchClient<{ count: number }>('/api/watch', setData);
    return () => closeSocket();
  }, []);

  return (
    <div class='counter text-center'>
      <button onClick={() => fetch(`/api/set-count?count=${data && data.count - 1}`)}>- 1</button>{' '}
      <button onClick={() => fetch(`/api/set-count?count=${data && data.count + 1}`)}>+ 1</button>
      <h2>{data?.count}</h2>
    </div>
  );
}
