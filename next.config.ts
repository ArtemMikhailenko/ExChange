/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ru'], // какие языки поддерживаем
    defaultLocale: 'en',   // язык по умолчанию
  },
  images: {
    domains: ['cdnexchange.ymca.one'], // Add the CDN domain here
  },
};

module.exports = nextConfig;
