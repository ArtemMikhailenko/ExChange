'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function WhyExchangeSection() {
  const { t } = useTranslation('common');

  // Создаем элементы с SVG иконками для верхнего ряда
  const topRowFeatures: FeatureItem[] = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 20C32 20 32 14 26 14C20 14 18 18 18 20C18 25 32 25 32 30C32 32 30 36 24 36C18 36 18 30 18 30" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="24" r="10" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M28 12C28 12 28 8 24 8C20 8 18 10 18 12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 36C18 36 18 40 24 40C30 40 30 36 30 36" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: t('reliableSecurity'),
      description: t('reliableSecurityDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6L8 14V16L24 24L40 16V14L24 6Z" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M24 28L8 20V22L24 30L40 22V20L24 28Z" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M24 34L8 26V28L24 36L40 28V26L24 34Z" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      title: t('derivativesTrading'),
      description: t('derivativesTradingDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="16" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M24 14V16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M32 24H34" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 32V34" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M16 24H14" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 20V24L30 30" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: t('stableAndSeamless'),
      description: t('stableAndSeamlessDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8V12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 36V40" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 24H8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M40 24H36" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="10" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M30 18L24 24" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: t('highPerformance'),
      description: t('highPerformanceDesc')
    }
  ];

  // Создаем элементы с SVG иконками для нижнего ряда
  const bottomRowFeatures: FeatureItem[] = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="6" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M16 24C16 24 12 24 12 20C12 16 16 16 16 16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M32 24C32 24 36 24 36 28C36 32 32 32 32 32" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 16C24 16 24 12 28 12C32 12 32 16 32 16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 32C24 32 24 36 20 36C16 36 16 32 16 32" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: t('minimumCommissions'),
      description: t('minimumCommissionsDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="28" width="28" height="12" rx="2" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M18 28V24C18 20.686 20.686 18 24 18V18C27.314 18 30 20.686 30 24V28" stroke="#FFD700" strokeWidth="1.5"/>
          <path d="M24 34V32" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 18L16 14H32L34 18" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t('fastDeposits'),
      description: t('fastDepositsDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8L8 16V32L24 40L40 32V16L24 8Z" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M24 20C26.2091 20 28 18.2091 28 16C28 13.7909 26.2091 12 24 12C21.7909 12 20 13.7909 20 16C20 18.2091 21.7909 20 24 20Z" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M24 20V28" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="32" r="2" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      title: t('highestSecurity'),
      description: t('highestSecurityDesc')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="8" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <circle cx="24" cy="24" r="3" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <path d="M35 24C35 24 38 28 40 24C42 20 38 16 38 16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 24C10 24 13 20 15 24C17 28 13 32 13 32" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 13C24 13 20 10 24 8C28 6 32 10 32 10" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 35C24 35 28 38 24 40C20 42 16 38 16 38" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t('smartTradingTools'),
      description: t('smartTradingToolsDesc')
    }
  ];

  return (
    <section className="py-20 bg-[#0D0D0D]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center pb-20">{t('whyExchange')}</h2>
        
        {/* Верхний ряд преимуществ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {topRowFeatures.map((feature, index) => (
            <div key={`top-${index}`} className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Нижний ряд преимуществ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bottomRowFeatures.map((feature, index) => (
            <div key={`bottom-${index}`} className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}