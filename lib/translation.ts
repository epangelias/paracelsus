import { IS_BROWSER } from 'fresh/runtime';

const Translations = {
  en: {
    welcome: "This is a welcome message",
    next: "Next"
  },
  la: {
    welcome: "Salve amice",
    next: "Sequens"
  },
  es: {
    welcome: "Hola amigo",
    next: "Siguiente"
  }
}

function parseLanguageHeader(req?: Request) {
  const text = req?.headers.get("accept-language");
  if (!text) return [];
  return text.split(',').map(l => l.split(';')[0]);
}

export function t(name: keyof typeof Translations.en, req?: Request) {
  const languages = IS_BROWSER ? navigator.languages : parseLanguageHeader(req);
  console.log(languages);
  const language = languages.find((lang) => Translations[lang as keyof typeof Translations] ||
    Translations[lang.split('-')[0] as keyof typeof Translations]);
  const translation = Translations[language as keyof typeof Translations] ||
    Translations[language?.split('-')[0] as keyof typeof Translations];
  if (!translation) return "ERROR";
  return translation[name];
}