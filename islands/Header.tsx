import { useGlobal } from '@/islands/Global.tsx';
import { site } from '@/app/site.ts';
import { Meth } from '@/lib/utils/meth.ts';
import { UserMenu } from '@/islands/UserMenu.tsx';
import IconBolt from 'tabler-icons/bolt.tsx';
import IconBoltOff from 'tabler-icons/bolt-off.tsx';

export function Header() {
  const global = useGlobal();

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
              {}
              {global.user.value.tokens > 0 ? <IconBolt /> : <IconBoltOff />}
              {global.user.value.isSubscribed ? '∞' : (global.user.value.tokens > 0 && global.user.value.tokens)}
            </span>
          )}

          <UserMenu />
        </div>
      </header>
    </>
  );
}
