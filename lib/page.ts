import * as YAML from '@std/yaml';
import { renderMarkdown } from './md.ts';
import { HttpError } from 'fresh';
import { marked } from 'marked';

export interface PageData {
  title: string;
  html: string;
}

export async function getPage(slug: string): Promise<PageData | null> {
  try {
    const text = await Deno.readTextFile(new URL('../pages/' + slug + '.md', import.meta.url));
    if (!text) return null;
    const [_, metaText, ...content] = text.split('---');
    if (!metaText) throw new HttpError(500);
    const meta = YAML.parse(metaText) as PageData;
    const html = await marked(content.join('---'));

    return { ...meta, html } as PageData;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return null;
    console.error('Error reading page file ' + e);
    throw new HttpError(500, 'Internal Server Error');
  }
}
