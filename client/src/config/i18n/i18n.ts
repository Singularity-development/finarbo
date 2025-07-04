import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import LazyImportPlugin from "./lazy-import-plugin";

i18n
  .use(HttpApi) // Load translations from files
  .use(LanguageDetector) // Detect user's language
  .use(LazyImportPlugin) // Lazy import translates
  .use(initReactI18next) // Bind with React
  .init({
    fallbackLng: "en-US",
    supportedLngs: ["en-US", "es-ES"],
    lng: localStorage.getItem("i18nextLng") ?? "en-US",
    debug: false,
    load: "currentOnly",
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    ns: [
      "global",
      "portfolio",
      "assets",
      "paths",
      "rules",
      "risks",
      "login",
      "signup",
      "errors",
    ], // Default namespaces
    defaultNS: "global",
  });

export default i18n;
