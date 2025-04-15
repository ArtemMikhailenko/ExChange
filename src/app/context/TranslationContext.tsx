// src/app/context/TranslationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type Translations = Record<string, string>;

type TranslationContextType = {
  t: (key: string) => string;
  lang: string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  lang: 'en'
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'en';
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    fetch(`/locales/${lang}/common.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Cannot load translations for ${lang}`);
        return res.json();
      })
      .then((json) => setTranslations(json))
      .catch(() => {
        fetch(`/locales/en/common.json`)
          .then((res) => res.json())
          .then((json) => setTranslations(json));
      });
  }, [lang]);

  const translate = (key: string) => translations[key] || key;

  return (
    <TranslationContext.Provider value={{ t: translate, lang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}