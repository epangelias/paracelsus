import { define } from '@/lib/utils.ts';
import { Page } from '@/components/Page.tsx';
import { SITE_CSS } from '@/plugins/css/mod.ts';

export default define.page(() => (
    <Page hideHeader={true}>
        <h1>Your Offline!</h1>
        <p>
            <a href='/'>Reload</a>
        </p>
        <style dangerouslySetInnerHTML={{ __html: SITE_CSS + '\nheader{display:none!important}' }}>
        </style>
    </Page>
));
