/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  images: {
    domains: ['cdnexchange.ymca.one','coinicons-api.vercel.app'],

  },
};

module.exports = nextConfig;
