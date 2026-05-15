import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tr from './locales/tr.json';
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import fa from './locales/fa.json';
import az from './locales/az.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar },
      ru: { translation: ru },
      zh: { translation: zh },
      fa: { translation: fa },
      az: { translation: az },
    },
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
