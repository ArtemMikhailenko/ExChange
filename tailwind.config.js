/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/app/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Добавляем или переопределяем цвета, если необходимо
          gray: {
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          yellow: {
            500: '#eab308',
            600: '#ca8a04',
          },
          white: '#ffffff',
          black: '#000000',
        },
      },
    },
    plugins: [],
  };