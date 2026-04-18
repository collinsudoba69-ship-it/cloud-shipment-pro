import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import enUS from "./locales/en-US";
import fr from "./locales/fr";
import es from "./locales/es";
import de from "./locales/de";
import ar from "./locales/ar";
import zh from "./locales/zh";
import pt from "./locales/pt";
import ptBR from "./locales/pt-BR";
import fi from "./locales/fi";
import sv from "./locales/sv";
import no from "./locales/no";
import da from "./locales/da";
import ro from "./locales/ro";
import nl from "./locales/nl";
import pl from "./locales/pl";
import cs from "./locales/cs";
import el from "./locales/el";
import hu from "./locales/hu";
import tr from "./locales/tr";
import ru from "./locales/ru";
import uk from "./locales/uk";
import hi from "./locales/hi";
import ja from "./locales/ja";
import ko from "./locales/ko";

const resources = {
  en: { translation: en },
  "en-US": { translation: enUS },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  ar: { translation: ar },
  zh: { translation: zh },
  pt: { translation: pt },
  "pt-BR": { translation: ptBR },
  fi: { translation: fi },
  sv: { translation: sv },
  no: { translation: no },
  da: { translation: da },
  ro: { translation: ro },
  nl: { translation: nl },
  pl: { translation: pl },
  cs: { translation: cs },
  el: { translation: el },
  hu: { translation: hu },
  tr: { translation: tr },
  ru: { translation: ru },
  uk: { translation: uk },
  hi: { translation: hi },
  ja: { translation: ja },
  ko: { translation: ko },
};

const SUPPORTED = [
  "en", "en-US", "fr", "es", "de", "ar", "zh", "pt", "pt-BR",
  "fi", "sv", "no", "da", "ro", "nl", "pl", "cs", "el", "hu",
  "tr", "ru", "uk", "hi", "ja", "ko",
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== "undefined" && localStorage.getItem("i18nextLng") ? undefined : "en-US",
    fallbackLng: "en-US",
    supportedLngs: SUPPORTED,
    nonExplicitSupportedLngs: false,
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      // Only use the user's saved choice; do not auto-detect from the browser.
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  });

export const LANGUAGES = [
  { code: "en", label: "English (UK)", flag: "🇬🇧" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "fi", label: "Suomi", flag: "🇫🇮" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export const SUPPORT_EMAIL = "cloudshipmentcontact@gmail.com";

export default i18n;
