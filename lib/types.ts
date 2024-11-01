

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

export interface Trigger<T> {
    name: string;
    value: unknown;
    data: T;
    respond: (name: string, value: unknown) => void;
    saveData: (data?: T) => Promise<void>;
}