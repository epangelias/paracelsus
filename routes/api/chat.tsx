import { define } from '@/lib/utils.ts';
import { handleWatchData } from '@/lib/handle-watch.ts';
import { ChatData } from '@/lib/types.ts';
import { generateChatCompletions } from '@/lib/oai.ts';

const AIOptions = {
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
    model: 'llama3.2:1b-instruct-q4_K_M',
};

export const handler = define.handlers({
    GET(ctx) {
        let generating = false;

        return handleWatchData<ChatData>(ctx, ['chat'], {
            async generate(trigger) {
                const stream = await generateChatCompletions(AIOptions, trigger.data.messages);

                let message = '';

                generating = true;
                for await (const item of stream) {
                    if (!generating) break;
                    const text = item.choices[0].delta.content;
                    message += text;
                    trigger.respond('generation', text);
                }

                const lastMessage = { role: 'assistant', content: '', id: Date.now() + '' };
                trigger.data.messages.push(lastMessage);

                lastMessage.content = message;
                trigger.saveData(trigger.data);
            },
            stop() {
                generating = false;
            },
        });
    },
});
