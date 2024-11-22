import { define } from '@/lib/utils.ts';
import { clearDb } from '@/tasks/db_reset.ts';

export const handler = define.handlers(async () => {
  await clearDb();
  return new Response('DONE');
});
