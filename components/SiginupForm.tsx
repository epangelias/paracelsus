import { Field } from '@/components/Field.tsx';
import { MessageBox } from './MessageBox.tsx';

export function SignupForm(
    { error, name, username }: { error: string; name: string; username: string },
) {
    return (
        <form method='POST'>
            <Field name='name' label='Name' required autofocus value={name} />
            <Field name='username' label='Email' type='email' required value={username} />
            <Field name='password' label='Password' type='password' required />

            <MessageBox error={error} />

            <div>
                <button>Sign Up</button>
                <a href='/user/signin'>Sign In</a>
            </div>
        </form>
    );
}
