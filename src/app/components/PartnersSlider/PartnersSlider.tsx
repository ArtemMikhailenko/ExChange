'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

type Partner = {
  name: string;
  logo: string;
};

export default function PartnersSlider() {
  const { t } = useTranslation('common');

  const partners: Partner[] = [
    {
      name: 'CerifyVASP',
      logo: '/images/partners/certify-vasp-logo.svg'
    },
    {
      name: 'Sumsub',
      logo: '/images/partners/sumsub-logo.svg'
    },
    {
      name: 'TokenInsight',
      logo: '/images/partners/token-insight-logo.svg'
    },
    {
      name: 'Matrix Partners',
      logo: '/images/partners/matrix-partners-logo.svg'
    },
    {
      name: 'CoinTelegraph',
      logo: '/images/partners/cointelegraph-logo.svg'
    }
  ];

  // Для демонстрации используем заглушки для изображений
  // Если изображения в /images/partners/ недоступны, примените этот подход
  const partnerIcons = [
    '/images/partners/certify-vasp-logo.svg',
    '/images/partners/sumsub-logo.svg', 
    '/images/partners/token-insight-logo.svg',
    '/images/partners/matrix-partners-logo.svg',
    '/images/partners/cointelegraph-logo.svg'
  ];

  // Дублируем список партнеров для создания бесконечной бегущей строки
  const duplicatedPartners = [...partnerIcons, ...partnerIcons, ...partnerIcons];

  return (
    <section className="py-10 bg-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="relative overflow-hidden">
            {/* Создаем бесконечную бегущую строку */}
            <div className="flex logos-slider">
              {duplicatedPartners.map((partner, index) => (
                <div key={`logo-${index}`} className="flex items-center justify-center px-8 mx-4">
                  <div 
                    className="h-48 w-32 rounded flex items-center justify-center text-gray-400"
                  >
                    <img src={partner} alt="" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Градиентные overlay по бокам для плавного перехода */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .logos-slider {
          white-space: nowrap;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * (${partners.length} * 156px)));
          }
        }
      `}</style>
    </section>
  );
}