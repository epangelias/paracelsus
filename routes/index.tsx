import { useSignal } from "@preact/signals";
import { define } from "../lib/utils.ts";
import Counter from "../islands/Counter.tsx";

export default define.page(function Home() {
  const count = useSignal(3);

  return (
    <div>
      <h1>Fresh Template</h1>
      <Counter count={count} />
    </div>
  );
});
