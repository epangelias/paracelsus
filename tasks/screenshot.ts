#!/usr/bin/env -S deno run -A --env --watch=static/,routes/,css/

// npx puppeteer browsers install firefox

import puppeteer from "npm:puppeteer";

console.log("Ensure app running locally at http://0.0.0.0:8000");

// Must modify for windows
const path = new URL("../static/img/screenshot.jpg", import.meta.url).href.slice(7);

const browser = await puppeteer.launch({ browser: "firefox", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 600, height: 315, deviceScaleFactor: 4 });
await page.goto("http://0.0.0.0:8000", { waitUntil: "networkidle0" });
await page.screenshot({ path });
await browser.close();