#!/usr/bin/env -S deno run -A

import * as Path from 'jsr:@std/path@1';
import { generateImages } from 'npm:pwa-asset-generator';
import { site } from '@/app/site.ts';
import puppeteer from 'npm:puppeteer';

async function takeScreenshot(filename: string, width: number, height: number) {
  console.log('Ensure app running locally at http://0.0.0.0:8000');

  const path = Path.join(import.meta.dirname!, '../static/img/' + filename);
  const browser = await puppeteer.launch({ browser: 'firefox', headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto('http://0.0.0.0:8000', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.body.style.zoom = '2.5';
      document.body.style.fontSize = '1rem';
    });
    await page.screenshot({ path });
  } catch (e) {
    console.error(e);
  }

  await browser.close();
}

takeScreenshot("screenshot-wide.jpg", 1280, 720);
takeScreenshot("screenshot-narrow.jpg", 750, 1280);

async function generateAssets(inputIcon: string, outputDir: string) {
  const result = await generateImages(inputIcon, outputDir, {
    background: site.backgroundColor,
    favicon: true,
    padding: '20%',
    pathOverride: '/img/gen',
  });

  const iconsJSON = Path.join(import.meta.dirname!, '../static/img/gen/icons.json');
  await Deno.writeTextFile(iconsJSON, JSON.stringify(result.manifestJsonContent, null, 2));
}

async function prepareIconPath(iconPath: string): Promise<string> {
  if (iconPath.startsWith('/')) {
    return Path.join(import.meta.dirname!, '../static/', iconPath);
  }

  // Download icon if url
  const res = await fetch(iconPath);
  const contentType = res.headers.get('content-type')?.split('/')[1].split('+')[0];
  const filePath = Path.join(import.meta.dirname!, `../static/img/gen/icon.${contentType}`);
  const imageData = new Uint8Array(await res.arrayBuffer());
  await Deno.writeFile(filePath, imageData);
  return filePath;
}

const outputDir = Path.join(import.meta.dirname!, '../static/img/gen');
const iconPath = await prepareIconPath(site.icon);

await generateAssets(iconPath, outputDir);
