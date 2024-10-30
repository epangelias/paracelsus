import { useSignal } from '@preact/signals';
import { define } from '../lib/utils.ts';
import Counter from '../islands/Counter.tsx';
import { siteData } from '../lib/siteData.ts';

export default define.page(function Home() {
  return (
    <main>
      <div>
        <h1>{siteData.title}</h1>
        <Counter />
      </div>
    </main>
  );
});
