import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/app/site.ts';
import { Meth } from '@/lib/utils/meth.ts';
import { UserMenu } from '@/islands/UserMenu.tsx';
import IconBolt from 'tabler-icons/bolt.tsx';

export function Header() {
  const global = useGlobal();

  const name = Meth.limitText(global.user.value?.name?.split(' ')[0], 15);

  return (
    <>
      <header>
        <div class='left'>
          <a href='/' class='logo' aria-label='Go to home page'>
            <img src={site.icon} width={48} height={48} alt='' />
            <span>{name}</span>
          </a>
        </div>
        <div class='right'>
          {global.user.value && (
            <span class='tokens'>
              <IconBolt />
              {global.user.value.isSubscribed ? '∞' : global.user.value.tokens}
            </span>
          )}

          <UserMenu />
        </div>
      </header>
    </>
  );
}
