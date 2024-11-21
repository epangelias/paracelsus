import { db, define } from '@/lib/utils.ts';

async function clearDb() {
    const itemsReset: Record<string, number> = {};

    const promises = [];

    for await (const res of db.list({ prefix: [] })) {
        const key = res.key.slice(0, -1).join('/');
        itemsReset[key] = itemsReset.hasOwnProperty(key) ? itemsReset[key] + 1 : 1;
        promises.push(db.delete(res.key));
    }

    await Promise.all(promises);
}

export const handler = define.handlers(async () => {
    await clearDb();
    return new Response("DONE");
})