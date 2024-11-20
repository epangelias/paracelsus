import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/lib/site.ts';
import { Meth } from '@/lib/meth.ts';

export function Header() {
  const global = useGlobal();

  const name = Meth.limitText(global.user.value?.name?.split(' ')[0], 15);

  return (
    <>
      <header>
        <div className='left'>
          <a href='/' class='color-primary logo' aria-label='Go to home page'>
            <img src={site.favicon} width={48} height={48} alt='' />
            <span>{site.name}</span>
          </a>
        </div>
        <div className='right'>
          {global.user.value && (
            <span class='tokens'>
              ⚡️{global.user.value.isSubscribed ? '∞' : global.user.value.tokens}
            </span>
          )}

          {global.user.value ? <a href='/user'>{name}</a> : <a href='/user/signin'>Sign In</a>}
        </div>
      </header>
    </>
  );
}
