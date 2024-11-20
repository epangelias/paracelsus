import { useGlobal } from '@/islands/Global.tsx';
import { Field } from '@/components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
  const global = useGlobal();

  if (!global.user.value) return <></>;

  return (
    <>
      <p>
        <a href='/user/signout'>Sign Out</a>
        {global.user.value?.isSubscribed
          ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
          : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
      </p>

      {!global.user.value?.isEmailVerified && (
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
          defaultValue={global.user.value?.name}
        />

        <Field
          name='email'
          label='Email'
          required
          autofocus
          defaultValue={global.user.value?.email}
        />

        <div>
          <button>Save</button>
          {message && <span class='message' role='status' aria-live='polite'>{message}</span>}
          {error && <span class='error-message' role='alert' aria-live='assertive'>{error}</span>}
        </div>
      </form>

      <div>
        <p>Worker: {!!global.worker}</p>
        <button onClick={global.requestSubscription} disabled={!global.pushSubscription}>
          Subscribe
        </button>
      </div>
    </>
  );
}
