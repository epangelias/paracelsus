import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { Field } from '@/components/Field.tsx';
import { MessageBox } from '../components/MessageBox.tsx';
import { useEffect } from 'preact/hooks';
import { IS_BROWSER } from 'fresh/runtime';

export function UserUI({ error, message }: { error?: string; message?: string }) {
    const global = useGlobal();
    const changed = useSignal(false);

    useEffect(() => {
        if (!global.value?.user && IS_BROWSER) globalThis.window.location.href = '/user/signin';
    }, [global.value]);

    return (
        <>
            <p>
                <a href='/user/signout'>Signout</a>
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
                    value={global.value.user?.name}
                    onInput={() => changed.value = true}
                />
                <Field
                    name='username'
                    label='Email'
                    required
                    value={global.value.user?.username}
                    onInput={() => changed.value = true}
                />

                <div>
                    <button disabled={!changed.value}>Save</button>
                    <MessageBox message={message} error={error} inline />
                </div>
            </form>
        </>
    );
}
