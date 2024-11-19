import { useGlobal } from '@/islands/Global.tsx';
import { Field } from '@/components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
  const global = useGlobal();

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
        />

        <Field
          name='email'
          label='Email'
          required
          autofocus
          defaultValue={global.value.user?.email}
        />

        <div>
          <button>Save</button>
          {message && <span class='message' role='status' aria-live='polite'>{message}</span>}
          {error && <span class='error-message' role='alert' aria-live='assertive'>{error}</span>}
        </div>
      </form>
      <div>
        <br />
        <button onClick={() => globalThis?.testPush()}>Test Push</button>
      </div>
    </>
  );
}
