import manifest from "@/static/manifest.json" with {type: "json"};

export const siteData = {
    title: manifest.name,
    emojiFavicon: '🎯',
    themeColor: manifest.theme_color,
    description: "A Deno Fresh template",
    email: "vaza@vaza.app"
};
