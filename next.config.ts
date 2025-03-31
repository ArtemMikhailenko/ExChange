/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ru'], // какие языки поддерживаем
    defaultLocale: 'en',   // язык по умолчанию
  },
};

module.exports = nextConfig;
