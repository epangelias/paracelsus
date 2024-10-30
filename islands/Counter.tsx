import { useSignal } from '@preact/signals';
import { watchData } from '../lib/watch-data.ts';
import { DataType } from '@/lib/types.ts';

export default function Counter() {
  const data = useSignal<DataType>({ count: 0 });

  watchData('/api/watch', data);

  return (
    <div class='counter text-center'>
      <button onClick={() => data.value = { count: data.value.count - 1 }}>- 1</button>{' '}
      <button onClick={() => data.value = { count: data.value.count + 1 }}>+ 1</button>
      <h2>{data.value.count}</h2>
    </div>
  );
}
