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

const resources = {
  en: { translation: en },
  "en-US": { translation: enUS },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  ar: { translation: ar },
  zh: { translation: zh },
  pt: { translation: pt },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "en-US", "fr", "es", "de", "ar", "zh", "pt"],
    nonExplicitSupportedLngs: false,
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export const LANGUAGES = [
  { code: "en", label: "English (UK)", flag: "🇬🇧" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export const SUPPORT_EMAIL = "cloudshipmentcontact@gmail.com";

export default i18n;
