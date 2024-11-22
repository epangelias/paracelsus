import { db, define } from '@/lib/utils.ts';

async function clearDb() {
  const promises = [];
  for await (const res of db.list({ prefix: [] })) {
    promises.push(db.delete(res.key));
  }
  await Promise.all(promises);
}

export const handler = define.handlers(async () => {
  await clearDb();
  return new Response('DONE');
});
