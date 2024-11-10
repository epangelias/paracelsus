export function SigninForm({ error, username }: { error: string; username: string }) {
    return (
        <form method='POST'>
            <div>
                <label for='username'>Email</label>
                <input
                    type='email'
                    id='username'
                    name='username'
                    value={username}
                    required
                    autofocus
                />
            </div>
            <div>
                <label for='password'>Password</label>
                <input type='password' name='password' id='password' required />
            </div>
            {error && <p class='error-message'>{error}</p>}
            <div>
                <button>Sign In</button>
                <a href='/user/signup'>Sign up</a>
            </div>
        </form>
    );
}
