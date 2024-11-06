export function SignupForm() {
    return (
        <form method='POST'>
            <div>
                <label for='name'>Name</label> <br />
                <input
                    type='text'
                    id='name'
                    name='name'
                    minlength={3}
                    maxlength={100}
                    required
                    autofocus
                />
            </div>
            <div>
                <label for='username'>Username</label> <br />
                <input
                    type='text'
                    id='username'
                    name='username'
                    minlength={3}
                    maxlength={100}
                    required
                />
            </div>
            <div>
                <label for='password'>Password</label> <br />
                <input
                    type='password'
                    name='password'
                    id='password'
                    minlength={6}
                    maxlength={100}
                    required
                />
            </div>
            <button>Login</button>
        </form>
    );
}
