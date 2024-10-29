import type { Signal } from '@preact/signals';

function padNumber(number: number, digits: number) {
  return '0'.repeat(digits).slice(0, -number.toString().length) + number;
}

export default function Counter({ count }: { count: Signal<number> }) {
  return (
    <div class='counter text-center'>
      <button onClick={() => count.value -= 1}>- 1</button>
      <big>
        <code>{` ${padNumber(count.value, 2)} `}</code>
      </big>
      <button onClick={() => count.value += 1}>+ 1</button>
    </div>
  );
}
