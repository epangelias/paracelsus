export function LoginForm() {
    return (
        <form method='POST'>
            <div>
                <label for='username'>Username</label>
                <br />
                <input type='text' id='username' name='username' required autofocus />
            </div>
            <div>
                <label for='password'>Password</label>
                <br />
                <input type='password' name='password' id='password' required />
            </div>
            <button>Login</button>
        </form>
    );
}
