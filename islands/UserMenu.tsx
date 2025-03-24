import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { limitText } from '@/lib/utils/meth.ts';

export function UserMenu() {
  const global = useGlobal();
  const popover = useRef<HTMLDivElement>(null);
  const isOpen = useSignal(false);
  const name = limitText(global.user.value?.name?.split(' ')[0], 15);

  const checkPopoverState = () => {
    isOpen.value = !!popover.current?.matches(':popover-open');
  };
  useEffect(() => {
    popover.current?.addEventListener('toggle', checkPopoverState);
    return () => popover.current?.removeEventListener('toggle', checkPopoverState);
  }, [popover.current]);

  return (
    <>
      {global.user.value
        ? (
          <button type='button' class='trigger link' popovertarget='user-menu-dropdown'>
            {isOpen.value ? '▾' : '▸'} {name}
          </button>
        )
        : <a href='/signin'>Sign In</a>}
      {global.user.value && (
        <div popover ref={popover} class='dropdown' id='user-menu-dropdown'>
          <ul>
            {global.stripeEnabled && (
              global.user.value?.isSubscribed
                ? (
                  <li>
                    <a href='/user/subscription'>Manage Subscription</a>
                  </li>
                )
                : (
                  <li>
                    <a href='/user/pricing'>Subscribe</a>
                  </li>
                )
            )}
            {global.authEnabled &&
              (
                <li>
                  <a href='/oauth/signout?success_url=/'>Sign Out</a>
                </li>
              )}
          </ul>
        </div>
      )}
    </>
  );
}
