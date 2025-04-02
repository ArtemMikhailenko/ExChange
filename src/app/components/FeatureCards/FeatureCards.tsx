'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

type FeatureCard = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export default function FeatureCards() {
  const { t } = useTranslation('common');

  const topRowCards: FeatureCard[] = [
    {
      title: t('meetAndFollowTitle'),
      subtitle: t('copyTrading'),
      imageSrc: '/images/copy-trading.svg',
      imageAlt: 'Copy Trading Icon'
    },
    {
      title: t('holdToMaximizeTitle'),
      subtitle: t('exchangeEarn'),
      imageSrc: '/images/exchange-earn.svg',
      imageAlt: 'Exchange Earn Icon'
    },
    {
      title: t('sepaTransferTitle'),
      subtitle: t('buyCrypto'),
      imageSrc: '/images/card-payment.svg',
      imageAlt: 'Card Payment Icon'
    }
  ];

  const bottomRowCards: FeatureCard[] = [
    {
      title: t('meetAndFollowTitle'),
      subtitle: t('copyTrading'),
      imageSrc: '/images/chart-trading.svg',
      imageAlt: 'Chart Trading Icon'
    },
    {
      title: t('holdToMaximizeTitle'),
      subtitle: t('exchangeEarn'),
      imageSrc: '/images/wallet-earn.svg',
      imageAlt: 'Wallet Earn Icon'
    },
    {
      title: t('holdToMaximizeTitle'),
      subtitle: t('exchangeEarn'),
      imageSrc: '/images/exchange-earn.svg',
      imageAlt: 'Exchange Earn Icon'
    }
  ];

  const CardRow = ({ cards }: { cards: FeatureCard[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1080px] mt-10 mb-18 mx-auto">

      {cards.map((card, index) => (
        <div 
          key={index} 
          className="rounded-lg p-6 border border-gray-800 bg-black hover:border-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{card.subtitle}</p>
            </div>
            <div className="w-24 h-24 relative">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <CardRow cards={topRowCards} />
          <CardRow cards={bottomRowCards} />
        </div>
      </div>
    </section>
  );
}