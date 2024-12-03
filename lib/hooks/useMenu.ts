import { useRef } from 'preact/hooks';
import { useSignal, useSignalEffect } from '@preact/signals';

export function useMenu() {
  const isOpen = useSignal(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useSignalEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        isOpen.value = false;
      }
    }

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        isOpen.value = false;
      }
    }

    if (isOpen.value) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  });

  return { isOpen, menuRef };
}
