import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTerminal from './locales/en/terminal.json';
import zhTerminal from './locales/zh/terminal.json';
import frTerminal from './locales/fr/terminal.json';

const resources = {
  en: { terminal: enTerminal },
  zh: { terminal: zhTerminal },
  fr: { terminal: frTerminal },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
