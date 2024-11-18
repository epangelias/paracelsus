import { define } from '@/lib/utils.ts';
import { SITE_CSS } from '@/routes/css.css.tsx';

export default define.page(() => (
    <main>
        <h1>Your Offline!</h1>
        <p>
            <a href='/'>Reload</a>
        </p>
        <style dangerouslySetInnerHTML={{ __html: SITE_CSS + '\nheader{display:none!important}' }}>
        </style>
    </main>
));
