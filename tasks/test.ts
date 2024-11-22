#!/usr/bin/env -S deno run -A --env

// npx puppeteer browsers install firefox

import puppeteer from 'npm:puppeteer';
import { deleteUser } from '@/lib/user.ts';
import { getUserIdByEmail } from '@/lib/user.ts';

await deleteUser(await getUserIdByEmail('test@test.test'));
await deleteUser(await getUserIdByEmail('test@test.test2'));

console.log('Ensure app running locally at http://0.0.0.0:8000');

// Must modify for windows

const browser = await puppeteer.launch({ browser: 'firefox', headless: false });
const page = await browser.newPage();

await page.goto('http://0.0.0.0:8000', { waitUntil: 'networkidle0' });

await page.click('header .right a');

await page.click('button + a'); // Sign up

await page.type('[name="name"]', 'Test');
await page.type('[name="email"]', 'test@test.test');
await page.type('[name="password"]', 'test@test.test');

await page.click('form button');

await new Promise((r) => setTimeout(r, 3000));

await page.click('header .right a');

await new Promise((r) => setTimeout(r, 1000));

await page.type('[name="name"]', 'New Name');
await page.type('[name="email"]', 'test@test.test2');

await page.click('form button');

await new Promise((r) => setTimeout(r, 1000));

await page.click('main p + p a');

await new Promise((r) => setTimeout(r, 5000));

await browser.close();
