/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ru'], // какие языки поддерживаем
    defaultLocale: 'en',   // язык по умолчанию
  },
  images: {
    domains: ['cdnexchange.ymca.one'], // Add the CDN domain here
  },
  experimental: {
    // this tells Next.js to treat "src" as the project root for app/pages
    srcDir: true,
  },
};

module.exports = nextConfig;
