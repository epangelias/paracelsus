import type { PageProps } from "fresh";
import { EmojiFavicon } from "@/components/EmojiFavicon.tsx";
import { siteData } from "../lib/siteData.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{siteData.title}</title>
        <link rel="stylesheet" href="/css/main.css" />
        <meta name="color-scheme" content="light dark" />
        <EmojiFavicon emoji={siteData.emojiFavicon} />
      </head>
      <body>
        <main>
          <Component />
        </main>
      </body>
    </html>
  );
}
