

export interface CounterData {
    count: number;
}

export interface AIMessage {
    role: string;
    content: string;
    html?: string;
}

export interface ChatData {
    messages: AIMessage[];
}


export interface OAIOptions {
    baseURL?: string;
    apiKey: string;
    model: string;
}


export interface User {
    id: string;
    username: string;
    passwordHash: string;
    salt: string;
    name: string;
    stripeCustomerId?: string;
    isSubscribed: boolean;
    tokens: number;
    isEmailVerified: boolean;
}

export interface GlobalData {
    user?: {
        name: string;
        tokens: number;
        isSubscribed: boolean;
    }
}