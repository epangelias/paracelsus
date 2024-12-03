import { useGlobal } from '@/islands/Global.tsx';
import { useSignal, useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { useMenu } from '../lib/hooks/useMenu.ts';

export function UserMenu() {
  const global = useGlobal();
  const { isOpen, menuRef } = useMenu();

  function toggle(e: Event) {
    e.stopPropagation();
    isOpen.value = !isOpen.value;
  }

  return (
    <div ref={menuRef} class='menu user-menu'>
      {global.user.value
        ? (
          <a href='javascript:void(0)' onClick={toggle} class='trigger'>
            {isOpen.value ? '▾' : '▸'} {global.user.value?.name}
          </a>
        )
        : <a href='/user/signin'>Sign In</a>}
      {global.user.value && (
        <div class='dropdown' data-open={isOpen.value} aria-hidden={!isOpen.value}>
          <ul>
            <li>
              <a href='/user'>Settings</a>
            </li>
            <li>
              {!global.user.value?.isSubscribed && <a href='/user/subscribe' target='_blank'>Subscribe</a>}
            </li>
            <li>
              <a href='/user/signout'>Sign Out</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
