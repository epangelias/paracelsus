import { useGlobal } from '@/islands/Global.tsx';
import { site } from '../app/site.ts';
import { Meth } from '@/lib/meth.ts';

export function Header() {
  const global = useGlobal();

  const name = Meth.limitText(global.user.value?.name?.split(' ')[0], 15);

  return (
    <>
      <header>
        <div class='left'>
          <a href='/' class='logo' aria-label='Go to home page'>
            <img src={site.icon} width={48} height={48} alt='' />
            <span>{site.name}</span>
          </a>
        </div>
        <div class='right'>
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
