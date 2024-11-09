export function SigninForm() {
    return (
        <form method='POST'>
            <div>
                <label for='username'>Email</label>
                <input type='email' id='username' name='username' required autofocus />
            </div>
            <div>
                <label for='password'>Password</label>
                <input type='password' name='password' id='password' required />
            </div>
            <div>
                <button>Sign In</button>
                <a href='/user/signup'>Sign up</a>
            </div>
        </form>
    );
}
