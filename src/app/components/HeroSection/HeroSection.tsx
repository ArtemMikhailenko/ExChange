'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@/app/context/ThemeContext';
import { useContext } from 'react';

export default function HeroSection() {
  const { t } = useTranslation('common');
  const { theme } = useContext(ThemeContext);

  return (
    <section className="w-full py-16 sm:py-24 pt-10">
      <div className="mx-auto max-w-7xl px-4 flex flex-col-reverse items-center justify-between gap-8 sm:flex-row">
        {/* Левая часть: Заголовок и кнопки */}
        <div className="flex flex-col items-center sm:items-start sm:w-1/2">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {t('heroTitle')}
          </h1>
          <div className="mt-10 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              href="/login"
              className="rounded border border-gray-300 dark:border-gray-700 px-20 py-3 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:text-gray-600"
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className="rounded bg-yellow-500 text-black px-20 py-3 text-center hover:bg-yellow-600 transition-colors"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
        
        {/* Правая часть: Картинка */}
        <div className="flex items-center justify-center sm:w-1/2">
        <Image
            src="/images/laptop-chart.png"
            alt="Laptop with charts"
            width={500}
            height={400}
            className="object-contain transform scale-x-[-1]"
            priority
        />
        </div>

      </div>
    </section>
  );
}