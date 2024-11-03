import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE } from '../lib/sse.ts';
import { CounterData } from '@/lib/types.ts';
import { useEffect } from 'preact/hooks';

const endpoint = '/api/counter';

export default function Counter({ data }: { data: CounterData }) {
  const counterData = useSignal(data);
  const setCount = (count: number) => sendSSE(endpoint, { count });

  useEffect(() => syncSSE(endpoint, counterData), []);

  return (
    <div class='counter text-center'>
      <button onClick={() => setCount(counterData.value.count - 1)}>- 1</button>{' '}
      <button onClick={() => setCount(counterData.value.count - 1)}>+ 1</button>
      <h2>{counterData.value.count}</h2>
    </div>
  );
}
