#!/usr/bin/env -S deno run -A --env

import * as Path from 'jsr:@std/path@1';
import { generateImages } from 'npm:pwa-asset-generator@6.4.0';
import puppeteer from 'npm:puppeteer';
import { delay } from '@std/async/delay';
import { Spinner } from 'jsr:@std/cli@1.0.9/unstable-spinner';
import { parseArgs } from 'jsr:@std/cli@1.0.9/parse-args';
import { $, download as downloadIfURL, helpCLI } from '@/lib/utils/cli.ts';
import sharp from 'npm:sharp';
import path from 'node:path';
import pngToICO from 'npm:png-to-ico';

const args = parseArgs<{ help: boolean, icon: string }>(Deno.args);

const _iconPath = args.icon;

if (args.help) {
  helpCLI({
    name: 'deno task generate',
    usage: 'deno task generate --icon <icon-path>',
    options: [
      { flag: '--help', usage: 'Show this help message' },
      { flag: '--icon', usage: 'Set the icon from a path or URL' }
    ],
  });
  Deno.exit();
}

const generatedIconPath = Path.join(import.meta.dirname!, '../static/img/icon.webp');
const localURL = 'http://0.0.0.0:8000';
const spinner = new Spinner({ color: 'green' });
const outputDir = Path.join(import.meta.dirname!, '../static/img/gen');
const screenshotWidePath = Path.join(import.meta.dirname!, '../static/img/gen/screenshot-wide.jpg');
const screenshotNarrowPath = Path.join(import.meta.dirname!, '../static/img/gen/screenshot-narrow.jpg');
const iconPath = _iconPath === undefined ? Path.join(import.meta.dirname!, '../static/img/icon.webp') : await downloadIfURL(_iconPath);

async function init() {
  spinner.start();

  if (iconPath != generatedIconPath) await sharp(iconPath).webp().toFile(generatedIconPath);

  const ps = await runApp();

  await screenshot(screenshotWidePath, 1280, 720);
  await screenshot(screenshotNarrowPath, 750, 1280);
  await generateAssets(iconPath, outputDir);
  await generateICO();

  spinner.stop();
  ps?.kill();
  Deno.exit();
}

async function runApp() {
  try {
    await fetch(localURL);
  } catch (_e) {
    spinner.message = 'Building app...';
    await $(path.join(import.meta.dirname!, './build.ts'));
    spinner.message = 'Running app...';

    const cmd = new Deno.Command(path.join(import.meta.dirname!, '../main.ts'), { stdout: 'piped', stderr: 'piped' });
    const ps = cmd.spawn();
    await delay(1000);
    return ps;
  }
  return null;
}

async function screenshot(path: string, width: number, height: number) {
  spinner.message = 'Generating screenshot...';

  const browser = await puppeteer.launch({ browser: 'chrome', headless: true });

  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(localURL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const html = document.querySelector('html') as HTMLElement;
    if (!html) return;
    html.style.zoom = '2';
    html.style.fontSize = '1rem';
  });

  await page.screenshot({ path, omitBackground: true });

  await browser.close();
}

async function generateAssets(inputIcon: string, outputDir: string) {
  spinner.message = 'Generating assets...';

  const result = await generateImages(inputIcon, outputDir, {
    // background: site.backgroundColor,
    background: 'linear-gradient(0deg, rgba(18,22,25,1) 0%, rgba(48,48,48,1) 100%)',
    favicon: true,
    padding: '10%',
    pathOverride: '/img/gen',
    log: false,
    scrape: false,
  });

  const iconsJSON = new URL('../static/img/gen/icons.json', import.meta.url);
  await Deno.writeTextFile(iconsJSON, JSON.stringify(result.manifestJsonContent, null, 2));
}

async function generateICO() {
  spinner.message = 'Generating ICO file...';
  const icoPath = Path.join(import.meta.dirname!, '../static/favicon.ico');
  const image = await sharp(iconPath).png().resize(196, 196).toBuffer();
  const icoResult = await pngToICO(image);
  await Deno.writeFile(icoPath, new Uint8Array(icoResult));
}

await init();
