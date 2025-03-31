// src/i18n.ts (или src/i18n.client.ts)
"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../public/locales/en/common.json';
import ruCommon from '../public/locales/ru/common.json';

void i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { common: enCommon },
      ru: { common: ruCommon },
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
