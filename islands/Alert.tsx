import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import InfoIcon from 'tabler-icons/alert-circle-filled';

export function Alert({ message, type, id }: { message: string; type: 'error' | 'success'; id: number }) {
  const hide = useSignal(false);

  useEffect(() => {
    hide.value = false;

    const timer = setTimeout(() => {
      hide.value = true;
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [message, type, id]);

  return (
    <div
      popover='auto'
      class={`alert ${type}`}
      role='alert'
      data-hide={hide.value}
    >
      <InfoIcon height='28' />
      {message}
      {/* <button class='close' onClick={(e) => hide.value = true}></button> */}
    </div>
  );
}
