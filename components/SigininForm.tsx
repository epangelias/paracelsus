import { Field } from '@/components/Field.tsx';

export function SigninForm({ error, username }: { error: string; username: string }) {
    return (
        <form method='POST'>
            <Field name='username' label='Username' required autofocus />
            <Field name='password' label='Password' required />
            {error && <p class='error-message'>{error}</p>}
            <div>
                <button>Sign In</button>
                <a href='/user/signup'>Sign up</a>
            </div>
        </form>
    );
}
