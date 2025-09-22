import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = {
  en: 'English',
  vi: 'Tiếng Việt',
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['action', 'common', 'datetime', 'sidebar'],
    defaultNS: 'common',

    // Namespaces to lookup key if not found in given namespace.
    fallbackNS: 'common',

    fallbackLng: 'vi',
    supportedLngs: Object.keys(supportedLanguages),
    debug: false,
    interpolation: {
      skipOnVariables: false,
      escapeValue: false, // not needed for react as it escapes by default
    },
    load: 'languageOnly',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Show translation keys while loading
    // saveMissing: true,
    // partialBundledLanguages: true,
    react: {
      // useSuspense: false // Prevent blank screen while loading translations
    },
  });

export default i18n;
