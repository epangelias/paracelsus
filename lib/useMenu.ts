import { useRef } from 'preact/hooks';
import { useSignal, useSignalEffect } from '@preact/signals';



export function useMenu() {
    const isOpen = useSignal(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useSignalEffect(() => {
        // Handle clicking outside the menu
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                isOpen.value = false;
            }
        }

        // Handle Escape key press
        function handleEscapeKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                isOpen.value = false;
            }
        }

        // Add event listeners when menu is open
        if (isOpen.value) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    });

    return { isOpen, menuRef };
}