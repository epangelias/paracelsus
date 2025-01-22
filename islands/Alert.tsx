import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import InfoIcon from 'tabler-icons/alert-circle-filled';

export function Alert({ message, type, id }: { message: string; type: 'error' | 'success'; id: number }) {
  const hide = useSignal(false);

  useEffect(() => {
    hide.value = false;

    const timer = setTimeout(() => {
      hide.value = true;
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, type, id]);

  return (
    <div
      popover='auto'
      class={`alert ${type}`}
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
      data-hide={hide.value}
    >
      <InfoIcon height='16' aria-hidden='true' />
      <p id={`alert-${id}`}>{message}</p>
    </div>
  );
}
