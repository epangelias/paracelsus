#!/usr/bin/env -S deno run -A --env

import { Builder } from 'fresh/dev';
import { app } from '@/main.ts';
import { compileCSS } from '@/lib/css.ts';

const builder = new Builder();

await compileCSS();

await builder.build(app);
