import { useGlobal } from '@/islands/Global.tsx';
import { Field } from '../components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
  const global = useGlobal();

  return (
    <>
      {global.user.value?.hasSubscribed && global.stripeEnabled && (
        <p>
          <a href='/user/subscription' target='_blank'>Manage Subscription</a>
        </p>
      )}

      {!global.user.value?.isSubscribed && global.stripeEnabled && (
        <p>
          <a href='/user/pricing'>Subscribe</a>
        </p>
      )}

      {!global.user.value?.isEmailVerified && global.mailEnabled && (
        <p>
          Please verify your email address. <a href='/user/resend-email'>Resend email</a>
        </p>
      )}

      <form method='POST'>
        <Field name='name' label='Name' required autofocus defaultValue={global.user.value?.name} />
        <Field name='email' label='Email' required autofocus defaultValue={global.user.value?.email} />

        <div>
          <button>Save</button>
          {message && <span class='message' role='status' aria-live='polite'>{message}</span>}
          {error && <span class='error-message' role='alert' aria-live='assertive'>{error}</span>}
        </div>
      </form>
    </>
  );
}
