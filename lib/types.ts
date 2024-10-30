

export interface CounterData {
    count: number;
}

export interface AIMessage {
    id: string;
    role: string;
    content: string;
}

export interface ChatData {
    messages: AIMessage[];
}