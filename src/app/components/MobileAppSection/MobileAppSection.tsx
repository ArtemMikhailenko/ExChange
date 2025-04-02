'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function MobileAppSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-20  bg-[#0D0D0D] overflow-hidden relative mb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Левая колонка с текстом */}
          <div className="lg:w-2/3 mb-12 lg:mb-0">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('tradeAnywhereTitle')}    
            </h2>
          </div>
          
          {/* Правая колонка с изображением */}
          <div className="lg:w-2/3 flex justify-center">
            <div className="relative w-full lg:max-w-[600px]">
              <Image
                src="/images/mobile-light.png"
                alt="Exchange Mobile App"
                layout="responsive"
                width={600}  // задаем 600 для десктопа
                height={600} // устанавливаем квадратное соотношение 1:1
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
