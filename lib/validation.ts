

export function validatePassword(password: string) {
    if (password.length < 6) throw new Error('Password must be at least 8 characters');
    if (password.length > 100) throw new Error('Password must be less than 100 characters');
}

export function validateEmail(email: string) {
    console.log(email);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) throw new Error("Invalid email");
    if (email.length > 320) throw new Error("Email must be less than 320 characters");
    if (email.length < 5) throw new Error("Email must be at least 5 characters");
}

export function validateName(name: string) {
    if (name.length < 3) throw new Error('Name must be at least 3 characters');
    if (name.length > 100) throw new Error('Name must be less than 100 characters');
    if (!/^[a-zA-Z\s]+$/.test(name)) throw new Error('Name must only contain letters and spaces');
}

export function normalizeName(name: string) {
    return name.trim().replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}