import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en/common.json';
import tr from './locales/tr/common.json';
import zh from './locales/zh/common.json';
import ja from './locales/ja/common.json';
import de from './locales/de/common.json';
import fr from './locales/fr/common.json';
import it from './locales/it/common.json';
import ru from './locales/ru/common.json';
import hi from './locales/hi/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
      zh: { translation: zh },
      ja: { translation: ja },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      ru: { translation: ru },
      hi: { translation: hi },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'tr', 'zh', 'ja', 'de', 'fr', 'it', 'ru', 'hi'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
