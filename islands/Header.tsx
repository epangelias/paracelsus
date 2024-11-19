import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';
import { Meth } from '@/lib/meth.ts';

export function Header() {
  const global = useGlobal();

  const name = Meth.limitText(global?.value.user?.name?.split(' ')[0], 15);

  return (
    <>
      <header>
        <div className='left'>
          <a href='/' class='color-primary logo'>
            <img src={site.favicon} width={48} height={48} alt='' />
            <span>{site.name}</span>
          </a>
        </div>
        <div className='right'>
          {global?.value.user && (
            <span class='tokens'>
              ⚡️{global.value.user.isSubscribed ? '∞' : global.value.user.tokens}
            </span>
          )}

          {global?.value.user ? <a href='/user'>{name}</a> : <a href='/user/signin'>Sign In</a>}
        </div>
      </header>
    </>
  );
}
