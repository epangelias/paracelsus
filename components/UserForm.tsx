import { User } from '@/lib/types.ts';

export function UserForm({ user, error }: { user?: User; error?: string }) {
    return (
        <form method='POST'>
            {error && <p class='error'>{error}</p>}
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
            <button>Save</button>
        </form>
    );
}
