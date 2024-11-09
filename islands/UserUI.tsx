import { useGlobal } from '@/islands/Global.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
    const global = useGlobal();

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
                <div>
                    <label for='name'>Name</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={global.value.user!.name}
                        required
                    />
                </div>
                <div>
                    <label for='username'>Email</label>
                    <input
                        type='email'
                        name='username'
                        id='username'
                        value={global.value.user!.username}
                        required
                    />
                </div>

                <div>
                    <button>Save</button>
                    {error && <span class='error-message'>{error}</span>}
                    {message && <span class='message'>{message}</span>}
                </div>
            </form>
        </>
    );
}
