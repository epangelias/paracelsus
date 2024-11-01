import { useSignal } from '@preact/signals';
import { watchData } from '../lib/watch-data.ts';
import { CounterData } from '@/lib/types.ts';
import { useEffect } from 'preact/hooks';

export default function Counter({ data }: { data: CounterData }) {
  const counterData = useSignal(data);

  watchData('/api/counter', counterData);

  function changeCount(change: number) {
    const body = JSON.stringify({ count: counterData.value.count + change });
    fetch('/api/counter', { method: 'POST', body });
  }

  return (
    <div class='counter text-center'>
      <button onClick={() => changeCount(-1)}>- 1</button>
      <button onClick={() => changeCount(+1)}>+ 1</button>
      <h2>{counterData.value.count}</h2>
    </div>
  );
}
