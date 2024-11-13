import { useGlobal } from '@/islands/Global.tsx';
import { useComputed, useSignal } from '@preact/signals';
import { Field } from '@/components/Field.tsx';
import { MessageBox } from '../components/MessageBox.tsx';
import { useEffect, useMemo } from 'preact/hooks';
import { IS_BROWSER } from 'fresh/runtime';

export function UserUI({ error, message }: { error?: string; message?: string }) {
    const global = useGlobal();
    const nameChanged = useSignal(false);
    const usernameChanged = useSignal(false);

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
                        nameChanged.value =
                            (e.target as HTMLInputElement).value !== global.value.user?.name}
                />
                <Field
                    name='username'
                    label='Email'
                    required
                    defaultValue={global.value.user?.username}
                    onInput={(e) =>
                        usernameChanged.value =
                            (e.target as HTMLInputElement).value !== global.value.user?.username}
                />

                <div>
                    <button disabled={!nameChanged.value && !usernameChanged.value}>Save</button>
                    <MessageBox message={message} error={error} inline />
                </div>
            </form>
        </>
    );
}
