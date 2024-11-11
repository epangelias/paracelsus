import { Field } from '@/components/Field.tsx';
import { MessageBox } from './MessageBox.tsx';

export function SigninForm({ error, username }: { error: string; username: string }) {
    return (
        <form method='POST'>
            <Field name='username' type='email' label='Email' value={username} required autofocus />
            <Field name='password' type='password' label='Password' required />

            <MessageBox error={error} />

            <div>
                <button>Sign In</button>
                <a href='/user/signup'>Sign up</a>
            </div>
        </form>
    );
}
