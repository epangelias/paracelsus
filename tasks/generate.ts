#!/usr/bin/env -S deno run -A

import * as Path from "jsr:@std/path@1";
import { generateImages } from "npm:pwa-asset-generator";
import { site } from '@/app/site.ts';

async function generateAssets(inputIcon: string, outputDir: string) {
    const result = await generateImages(inputIcon, outputDir, {
        background: site.backgroundColor,
        favicon: true,
        // padding: "0%",
        pathOverride: '/img/gen',
    });

    const iconsJSON = Path.join(import.meta.dirname!, "../static/img/gen/icons.json");
    await Deno.writeTextFile(iconsJSON, JSON.stringify(result.manifestJsonContent, null, 2));
}

async function prepareIconPath(iconPath: string): Promise<string> {
    if (iconPath.startsWith('/')) {
        return Path.join(import.meta.dirname!, "../static/", iconPath);
    }

    // Download icon if url
    const res = await fetch(iconPath);
    const contentType = res.headers.get("content-type")?.split("/")[1].split("+")[0];
    const filePath = Path.join(import.meta.dirname!, `../static/img/gen/icon.${contentType}`);
    const imageData = new Uint8Array(await res.arrayBuffer());
    await Deno.writeFile(filePath, imageData);
    return filePath;
}

const outputDir = Path.join(import.meta.dirname!, "../static/img/gen");
const iconPath = await prepareIconPath(site.icon);

await generateAssets(iconPath, outputDir);