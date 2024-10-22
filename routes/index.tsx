import { useSignal } from "@preact/signals";
import { define } from "../lib/utils.ts";
import Counter from "../islands/Counter.tsx";
import { siteData } from "@/siteData.ts";

export default define.page(function Home() {
  const count = useSignal(3);

  return (
    <div>
      <h1>{siteData.title}</h1>
      <Counter count={count} />
    </div>
  );
});
