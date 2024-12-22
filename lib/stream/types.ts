export interface AIMessage {
  role: string;
  content: string;
  html?: string;
}

export interface OAIOptions {
  baseURL?: string;
  apiKey: string;
  model: string;
}
