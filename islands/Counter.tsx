import type { Signal } from '@preact/signals';

export default function Counter({ count }: { count: Signal<number> }) {
  return (
    <div class='counter'>
      <button onClick={() => count.value -= 1}>- 1</button>
      <span>{` ${count} `}</span>
      <button onClick={() => count.value += 1}>+ 1</button>
    </div>
  );
}
