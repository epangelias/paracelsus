import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { Field } from '@/components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
  const global = useGlobal();
  const nameChanged = useSignal(false);

  if (!global?.value?.user) return <></>;

  return (
    <>
      <p>
        <a href='/user/signout'>Sign Out</a>
        {global.value.user?.isSubscribed
          ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
          : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
      </p>

      {!global.value.user?.isEmailVerified && (
        <p>
          Please verify your email address. <a href='/user/resend-email'>Resend email</a>
        </p>
      )}

      <form method='POST'>
        <Field
          name='name'
          label='Name'
          required
          autofocus
          defaultValue={global.value.user?.name}
          onInput={(e) =>
            nameChanged.value = (e.target as HTMLInputElement).value !== global.value.user?.name}
        />

        <div>
          <button disabled={!nameChanged.value}>Save</button>
          {message && <span class='message'>{message}</span>}
          {error && <span class='error-message'>{error}</span>}
        </div>
      </form>
    </>
  );
}
