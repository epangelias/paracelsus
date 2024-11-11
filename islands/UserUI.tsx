import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { Field } from '@/components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
    const global = useGlobal();
    const changed = useSignal(false);

    return (
        <>
            <p>
                <a href='/user/signout'>Signout</a>
                {global.value.user!.isSubscribed
                    ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
                    : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
            </p>

            {!global.value.user!.isEmailVerified && (
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
                    value={global.value.user!.name}
                    onInput={() => changed.value = true}
                />
                <Field
                    name='username'
                    label='Email'
                    required
                    value={global.value.user!.username}
                    onInput={() => changed.value = true}
                />

                <div>
                    <button disabled={!changed.value}>Save</button>
                    {error && <span class='error-message'>{error}</span>}
                    {message && <span class='message'>{message}</span>}
                </div>
            </form>
        </>
    );
}
