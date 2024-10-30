import { useSignal } from '@preact/signals';
import { watchData } from '../lib/watch-data.ts';
import { CounterData } from '@/lib/types.ts';

export default function Counter({ data }: { data: CounterData }) {
  const counterData = useSignal<CounterData>(data);

  watchData('/api/watch', counterData);

  return (
    <div class='chat-box'>
      <button onClick={() => counterData.value = { count: counterData.value.count - 1 }}>- 1</button>{' '}
      <button onClick={() => counterData.value = { count: counterData.value.count + 1 }}>+ 1</button>
      <h2>{counterData.value.count}</h2>
    </div>
  );
}
