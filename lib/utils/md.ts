import * as ammonia from 'ammonia';
import { marked } from 'marked';

let waiting: void | true = true;

export async function renderMarkdown(input: string): Promise<string> {
  if (waiting) waiting = await ammonia.init();
  return ammonia.clean(await marked(input));
}
