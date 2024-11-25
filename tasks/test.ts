// npx puppeteer browsers install firefox

import puppeteer from 'npm:puppeteer';
import { deleteUser } from '@/lib/user-data.ts';
import { getUserIdByEmail } from '@/lib/user-data.ts';

// Clean up test data
await deleteUser(await getUserIdByEmail('test@test.test'));
await deleteUser(await getUserIdByEmail('test@test.test2'));

console.log('Ensure app running locally at http://0.0.0.0:8000');

// Launch browser
const browser = await puppeteer.launch({
    // browser: "firefox",
    headless: false,    // Enable non-headless mode for debugging
});

const page = await browser.newPage();

// Navigate to the app
await page.goto('http://0.0.0.0:8000', { waitUntil: 'networkidle0' });

// Click on the login/signup link in the header
await page.waitForSelector('header .right a'); // Wait for the selector to be visible
await page.click('header .right a');

// Click the "Sign Up" link
await page.waitForSelector('button + a'); // Wait for the "Sign Up" button to appear
await page.click('button + a');

// Fill in the signup form
await page.waitForSelector('[name="name"]');
await page.type('[name="name"]', 'Test');
await page.type('[name="email"]', 'test@test.test');
await page.type('[name="password"]', 'test@test.test');

// Submit the signup form
await Promise.all([
    page.click('form button'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }), // Wait for form submission to complete
]);

// Log out by clicking the header link
await page.waitForSelector('header .right a');
await page.click('header .right a');

// Fill in the signup form with a new user
await page.waitForSelector('[name="name"]');
await page.type('[name="name"]', 'New Name');
await page.type('[name="email"]', 'test@test.test2');
await page.type('[name="password"]', 'test@test.test2');

// Submit the form again
await Promise.all([
    page.click('form button'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

// Click on a link to navigate (e.g., "main p + p a")
await page.waitForSelector('main p + p a'); // Wait for the link to be visible
await page.click('main p + p a');

// Close the browser
await browser.close();
