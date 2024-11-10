export function SignupForm(
    { error, name, username }: { error: string; name: string; username: string },
) {
    return (
        <form method='POST'>
            <div>
                <label for='name'>Name</label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    minlength={3}
                    maxlength={100}
                    required
                    autofocus
                    value={name}
                />
            </div>
            <div>
                <label for='username'>Email</label>
                <input
                    type='email'
                    id='username'
                    name='username'
                    minlength={3}
                    maxlength={100}
                    required
                    value={username}
                />
            </div>
            <div>
                <label for='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    minlength={6}
                    maxlength={100}
                    required
                />
            </div>
            {error && <p class='error-message'>{error}</p>}
            <div>
                <button>Sign Up</button>
                <a href='/user/signin'>Sign in</a>
            </div>
        </form>
    );
}
