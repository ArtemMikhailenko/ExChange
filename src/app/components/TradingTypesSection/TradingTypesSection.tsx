'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

type TradingType = {
  title: string;
  description: React.ReactNode;
  link: string;
};

export default function TradingTypesSection() {
  const { t } = useTranslation('common');

  // Создаем типы торговли с ReactNode для частей текста с выделением
  const tradingTypes: TradingType[] = [
    {
      title: t('spot'),
      description: (
        <>
          {t('spotDescriptionPrefix')} <span className="font-bold text-white">1000+</span> {t('spotDescriptionSuffix')}
        </>
      ),
      link: '/spot'
    },
    {
      title: t('futures'),
      description: (
        <>
          {t('futuresDescriptionPrefix')} <span className="font-bold text-white">125x</span> {t('futuresDescriptionSuffix')}
        </>
      ),
      link: '/futures'
    },
    {
      title: t('gridTrading'),
      description: (
        <>
          {t('gridTradingDescriptionPrefix')} <span className="font-bold text-white">24/7</span> {t('gridTradingDescriptionSuffix')}
        </>
      ),
      link: '/grid-trading'
    }
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tradingTypes.map((type, index) => (
            <div key={index} className="flex flex-col">
              <h2 className="text-3xl font-bold mb-4">{type.title}</h2>
              <p className="text-gray-400 mb-8">
                {type.description}
              </p>
              <div className="mt-auto">
                <Link 
                  href={type.link} 
                  className="inline-block text-gray-300 hover:text-white border-b border-gray-700 hover:border-gray-300 transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}