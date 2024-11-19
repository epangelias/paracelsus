import { Header } from '@/islands/Header.tsx';
import { JSX } from 'preact';

interface PageProps {
    children: JSX.Element | JSX.Element[];
    hideHeader?: boolean;
}

export function Page(props: PageProps) {
    return (
        <div class='container'>
            {!props.hideHeader && <Header />}
            <main>{props.children}</main>
        </div>
    );
}
