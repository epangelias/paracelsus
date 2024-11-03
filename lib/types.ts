

export interface CounterData {
    count: number;
}

export interface AIMessage {
    role: string;
    content: string;
}

export interface ChatData {
    messages: AIMessage[];
}


export interface OAIOptions {
    baseURL?: string;
    apiKey: string;
    model: string;
}