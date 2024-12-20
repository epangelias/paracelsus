import { Header } from '@/islands/Header.tsx';
import { ComponentChildren } from 'preact';
import { Banners } from '@/islands/Banner.tsx';
import { OutOfTokensDialog } from '@/islands/OutOfTokensDialog.tsx';

export function Page(
  props: { children: ComponentChildren; hideHeader?: boolean; hideBanner?: boolean },
) {
  return (
    <div class='container'>
      {!props.hideHeader && <Header />}
      {!props.hideBanner && <Banners />}
      <div class='scrollable'>
        <main>{props.children}</main>
      </div>
      <OutOfTokensDialog />
    </div>
  );
}
