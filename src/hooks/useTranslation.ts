"use client";

import { usePathname, useSearchParams } from "next/navigation";
import en from "../../public/locales/en/common.json";
import ru from "../../public/locales/ru/common.json";


const translations: Record<string, any> = { en, ru};

export function useTranslation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Получаем язык из URL (например, ?lang=es)
  const lang = searchParams.get("lang") || "en";

  return translations[lang] || translations["en"];
}
