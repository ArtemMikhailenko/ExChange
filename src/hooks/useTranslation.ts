'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Translations = Record<string, string>;

export function useTranslation() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const [t, setT] = useState<Translations>({});

  useEffect(() => {
    // Load JSON from public/locales/{lang}/common.json
    fetch(`/locales/${lang}/common.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Cannot load translations for ${lang}`);
        return res.json();
      })
      .then((json) => setT(json))
      .catch(() => {
        // If failed, load English as fallback
        fetch(`/locales/en/common.json`)
          .then((res) => res.json())
          .then((json) => setT(json));
      });
  }, [lang]);

  // Translation function
  const translate = (key: string) => t[key] || key;

  return { t: translate, lang };
}