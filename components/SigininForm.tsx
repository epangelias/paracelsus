import { Field } from '@/components/Field.tsx';

export function SigninForm({ error, email }: { error: string; email: string }) {
  return (
    <form method='POST'>
      <Field name='email' type='email' label='Email' value={email} required autofocus />
      <Field name='password' type='password' label='Password' required />

      {error && <p class='error-message' role='alert' aria-live='assertive'>{error}</p>}

      <div>
        <button>Sign In</button>
        <a href='/user/signup'>Sign Up</a>
      </div>
    </form>
  );
}
