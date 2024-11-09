import { User } from '@/lib/types.ts';

export function UserForm(
    { user, error, message }: { user?: User; error?: string; message?: string },
) {
    return (
        <form method='POST'>
            <div>
                <label for='name'>Name</label>
                <input type='text' name='name' id='name' value={user!.name} required />
            </div>
            <div>
                <label for='username'>Email</label>
                <input
                    type='email'
                    name='username'
                    id='username'
                    value={user!.username}
                    required
                />
            </div>

            <div>
                <button>Save</button>
                {error && <span class='error-message'>{error}</span>}
                {message && <span class='message'>{message}</span>}
            </div>
        </form>
    );
}
