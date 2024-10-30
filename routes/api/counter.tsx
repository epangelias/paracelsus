import { define } from '@/lib/utils.ts';
import { handleWatchData } from '@/lib/handle-watch.ts';

export const handler = define.handlers({
    GET: (ctx) => handleWatchData(ctx, ['counterData']),
});
