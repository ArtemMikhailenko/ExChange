'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useExchangeData } from '@/hooks/useExchangeData';

type TradingBot = {
  name: string;
  icon: string | React.ReactNode;
  performance: string;
  period: string;
  copiers: number;
  chart?: React.ReactNode;
};

export default function RoboTradingSection() {
  const { t } = useTranslation('common');
  const exchangeData = useExchangeData();

  // Получаем данные ботов из WebSocket, если они доступны
  const tradingBotsData = useMemo(() => {
    // Если есть данные из WebSocket, можно использовать их
    if (exchangeData && exchangeData.tradingBots) {
      return exchangeData.tradingBots;
    }
    
    // Иначе используем статические данные
    return null;
  }, [exchangeData]);

  // Данные для торговых ботов
            //@ts-ignore

  const tradingBots: TradingBot[] = tradingBotsData || [
    {
      name: 'AI_TRADE',
      icon: (
        <Image 
          src="/images/bots/ai-trade-box.png" 
          alt="AI_TRADE" 
          width={36} 
          height={36} 
          className="object-contain"
        />
      ),
      performance: '+65.57%',
      period: '30D ROI',
      copiers: 14647,
      chart: (
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 30C10 30 20 35 30 32C40 29 50 26 60 24C70 22 80 19 90 15C100 11 110 10 120 5" 
            stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      )
    },
    {
      name: 'ZenTrader_v1',
      icon: (
        <Image 
          src="/images/bots/zen-trader-icon.png" 
          alt="ZenTrader" 
          width={36} 
          height={36} 
          className="object-contain"
        />
      ),
      performance: '+63.98%',
      period: '30D ROI',
      copiers: 2123
    }
  ];

  // Статистика платформы
  const platformStats = [
    {
      value: '17,000+',
      label: t('eliteTraders')
    },
    {
      value: '51M+',
      label: t('copierEarnings')
    },
    {
      value: '600M+',
      label: t('totalOrders')
    }
  ];

  return (
    <section className="py-20 bg-[var(--background)] dark:bg-[var(--background-dark)] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Левая колонка с заголовком и статистикой */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-bold mb-10 ">
              Robo Trading: Invest Less, Earn More
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-10">
              {platformStats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl font-bold ">{stat.value}</span>
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <Link 
              href="/robo-trading" 
              className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded transition-colors"
            >
              Learn More
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          
          {/* Правая колонка с карточками ботов */}
          <div className="lg:w-2/3 flex flex-col sm:flex-row gap-6 pb-4">
            {/* Первая карточка бота */}
            <div className="flex-shrink-0 w-full sm:w-2/3 bg-[#0a0b0d] rounded-2xl p-6 ">
              <div className="flex items-center gap-3 mb-6">
                {typeof tradingBots[0].icon === 'string' ? (
                  <Image 
                    src={tradingBots[0].icon} 
                    alt={tradingBots[0].name} 
                    width={36} 
                    height={36} 
                    className="object-contain"
                  />
                ) : (
                  tradingBots[0].icon
                )}
                <span className="font-medium text-white text-xl">{tradingBots[0].name}</span>
              </div>
              
              <div className="mb-6">
                <div className="text-green-500 text-4xl font-bold">
                  {tradingBots[0].performance}
                </div>
                <div className="text-gray-400 text-lg mt-1">
                  {tradingBots[0].period}
                </div>
              </div>
              
              {tradingBots[0].chart && (
                <div className="mb-6">
                  {tradingBots[0].chart}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-white text-lg">
                    {tradingBots[0].copiers.toLocaleString()}
                    <span className="text-gray-500 ml-1">Copiers</span>
                  </span>
                </div>
                
                <button className="bg-[#282828] hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors text-lg">
                  Copy
                </button>
              </div>
            </div>
            
            {/* Вторая карточка бота - с градиентом */}
            <div className="flex-shrink-0 w-full sm:w-1/2 relative rounded-2xl p-6 overflow-hidden ">
              {/* Абсолютный слой с однотонным затемнением */}
              <div className="absolute bg-[#0a0b0d] inset-0 bg-black opacity-50"></div>
              {/* Дополнительный градиент, если требуется */}
              <div className="absolute bg-[#0a0b0d] inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70"></div>
              
              {/* Содержимое карточки – поверх наложенных слоёв */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  {typeof tradingBots[1].icon === 'string' ? (
                    <Image 
                      src={tradingBots[1].icon} 
                      alt={tradingBots[1].name} 
                      width={36} 
                      height={36} 
                      className="object-contain"
                    />
                  ) : (
                    tradingBots[1].icon
                  )}
                  <span className="font-medium text-white text-xl">{tradingBots[1].name}</span>
                </div>
                            
                <div className="mb-6">
                  <div className="text-green-500 text-4xl font-bold">
                    {tradingBots[1].performance}
                  </div>
                  <div className="text-gray-400 text-lg mt-1">
                    {tradingBots[1].period}
                  </div>
                </div>
                            
                <div className="flex items-center">
                  <span className="text-white text-lg">
                    {tradingBots[1].copiers.toLocaleString()}
                    <span className="text-gray-500 ml-1">Copiers</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}