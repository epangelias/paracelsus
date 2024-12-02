import { Field } from '@/lib/components/Field.tsx';

export function SignupForm(
  { error, name, email }: { error: string; name: string; email: string },
) {
  return (
    <form method='POST'>
      <Field name='name' label='Name' required autofocus value={name} />
      <Field name='email' label='Email' type='email' required value={email} />
      <Field name='password' label='Password' type='password' required />

      {error && <p class='error-message' role='alert' aria-live='assertive'>{error}</p>}

      <div>
        <button>Sign Up</button>
        <a href='/user/signin'>Sign In</a>
      </div>
    </form>
  );
}
