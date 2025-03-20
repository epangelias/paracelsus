import { define } from '@/lib/utils/utils.ts';
import { Page } from '@/components/Page.tsx';
import IconGithub from 'icons/tabler/brand-github';
import { page } from 'fresh';

export const handler = define.handlers((ctx) => {
  if (ctx.state.user) return ctx.redirect('/');
  return page();
});

export default define.page(() => (
  <Page hideHeader hideBanner>
    <div>
      <h1>Sign In</h1>
      <a
        href='/oauth/signin'
        class='button'
        style={{
          background: 'var(--bg3)',
          color: 'var(--fg2)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <IconGithub height={24} />
        Sign in with Github
      </a>
    </div>
  </Page>
));
