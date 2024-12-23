import { useGlobal } from '@/islands/Global.tsx';

export function OutOfTokensDialog() {
  const global = useGlobal();

  function onClick(event: MouseEvent) {
    const dialog = event.target as HTMLDialogElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) dialog.close();
  }

  return (
    <dialog id='out-of-tokens-dialog' onClick={onClick}>
      <form method='dialog'>
        <button>×</button>
      </form>
      <h2>You are out of tokens!</h2>
      {global.user.value?.isSubscribed || !global.user.value?.hasVerifiedEmail && global.mailEnabled
        ? (
          <p>
            Please verify your email address to receive more tokens. <a href='/user/resend-email'>Resend email</a>
          </p>
        )
        : global.stripeEnabled && (
          <p>
            Subscribe for unlimited tokens. <a href='/user/pricing'>Subscribe</a>
          </p>
        )}
    </dialog>
  );
}

export function showOutOfTokensDialog() {
  const dialog = document.getElementById('out-of-tokens-dialog') as HTMLDialogElement;
  dialog.showModal();
}
