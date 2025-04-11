export const defaultLocale = 'en';
export const locales = ['en', 'ru'] as const;
export type ValidLocale = typeof locales[number];

// Получение языка из пути
export function getLocaleFromPath(path: string): ValidLocale | undefined {
  const segments = path.split('/').filter(Boolean);
  const locale = segments[0] as ValidLocale;
  
  if (locales.includes(locale)) {
    return locale;
  }
  
  return undefined;
}

// Получение пути без языкового префикса
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const locale = segments[0] as ValidLocale;
  
  if (locales.includes(locale)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return path;
}

// Создание пути с языковым префиксом
export function createLocalizedPath(path: string, locale: ValidLocale): string {
  // Удаляем начальный слеш, если есть
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Удаляем текущий языковой префикс, если он есть
  const pathWithoutLocale = removeLocaleFromPath('/' + cleanPath);
  
  // Если путь корневой, просто возвращаем локаль
  if (pathWithoutLocale === '/') {
    return `/${locale}`;
  }
  
  // Иначе добавляем локаль к пути
  return `/${locale}${pathWithoutLocale}`;
}