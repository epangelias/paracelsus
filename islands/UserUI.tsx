import { useGlobal } from '@/islands/Global.tsx';
import { Field } from '@/components/Field.tsx';
import { Form } from '@/islands/Form.tsx';
import { FormButton } from '@/components/FormButton.tsx';

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

      <Form method='POST'>
        <Field name='name' label='Name' required autofocus defaultValue={global.user.value?.name} />
        <Field name='email' label='Email' required autofocus defaultValue={global.user.value?.email} />

        <FormButton class='wide'>Save</FormButton>
        {message && <span class='message' role='status' aria-live='polite'>{message}</span>}
        {error && <span class='error-message' role='alert' aria-live='assertive'>{error}</span>}
      </Form>
    </>
  );
}
