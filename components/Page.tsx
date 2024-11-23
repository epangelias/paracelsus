import { Header } from '@/islands/Header.tsx';
import { ComponentChildren, JSX } from 'preact';
import { Banners } from '@/islands/Banner.tsx';

export function Page(
  props: { children: ComponentChildren; hideHeader?: boolean; hideBanner?: boolean },
) {
  return (
    <div class='container'>
      {!props.hideHeader && <Header />}
      {!props.hideBanner && <Banners />}
      <div className='scrollable'>
        <main>{props.children}</main>
      </div>
    </div>
  );
}
