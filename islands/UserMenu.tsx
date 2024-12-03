import { useGlobal } from '@/islands/Global.tsx';
import { useSignal, useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';

export function UserMenu() {
  const global = useGlobal();
  const open = useSignal(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggle(e: Event) {
    e.stopPropagation();
    open.value = !open.value;
  }

  useSignalEffect(() => {
    // Handle clicking outside the menu
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        open.value = false;
      }
    }

    // Handle Escape key press
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        open.value = false;
      }
    }

    // Add event listeners when menu is open
    if (open.value) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  });

  return (
    <div ref={menuRef} class='menu user-menu'>
      {global.user.value
        ? (
          <a href='javascript:void(0)' onClick={toggle} class='trigger'>
            {open.value ? '▾' : '▸'} {global.user.value?.name}
          </a>
        )
        : <a href='/user/signin'>Sign In</a>}
      <div class='dropdown' data-open={open.value} aria-hidden={!open.value}>
        <ul>
          <li>
            {global.pwa.worker.value && !global.pwa.pushSubscription.value && (
              <a onClick={global.pwa.requestSubscription} href='javascript:void(0);'>Enable Notifications</a>
            )}
          </li>
          <li>
            {global.user.value?.isSubscribed
              ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
              : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
          </li>
          <li>
            <a href='/user'>Settings</a>
          </li>
          <li>
            <a href='/user/signout'>Sign Out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
