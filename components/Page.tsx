import { Header } from '@/islands/Header.tsx';
import { ComponentChildren, JSX } from 'preact';
import { Banners } from '@/islands/Banner.tsx';

interface PageProps {
    children: ComponentChildren;
    hideHeader?: boolean;
    hideBanner?: boolean;
}

export function Page(props: PageProps) {
    return (
        <div class='container'>
            {!props.hideHeader && <Header />}
            {!props.hideBanner && <Banners />}
            <main>{props.children}</main>
        </div>
    );
}
