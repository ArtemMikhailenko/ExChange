'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useExchangeData } from '@/hooks/useExchangeData';

type CryptoCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
};

// Маппинг имен и данных монет
const coinMetadata: Record<string, { name: string; image: string; volume24h: number }> = {
  btcusdt: {
    name: 'Bitcoin',
    image: '/images/crypto/btc.svg',
    volume24h: 123460000
  },
  ethusdt: {
    name: 'Ethereum',
    image: '/images/crypto/eth.svg',
    volume24h: 69530000
  },
  solusdt: {
    name: 'Solana',
    image: '/images/crypto/sol.svg',
    volume24h: 35790000
  },
  bnbusdt: {
    name: 'BNB',
    image: '/images/crypto/bnb.svg',
    volume24h: 28460000
  },
  xrpusdt: {
    name: 'XRP',
    image: '/images/crypto/xrp.svg',
    volume24h: 15230000
  },
  dogeusdt: {
    name: 'Dogecoin',
    image: '/images/crypto/doge.svg',
    volume24h: 9875000
  },
  adausdt: {
    name: 'Cardano',
    image: '/images/crypto/ada.svg',
    volume24h: 8450000
  },
  avaxusdt: {
    name: 'Avalanche',
    image: '/images/crypto/avax.svg',
    volume24h: 7650000
  }
};

// Резервное изображение для неизвестных монет
const fallbackCoinData = {
  name: 'Unknown',
  image: '/images/crypto/generic.svg',
  volume24h: 500000
};

// Резервные данные для когда WebSocket еще не предоставил информацию
const fallbackData: CryptoCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    image: '/images/crypto/btc.svg',
    price: 83738.1,
    change24h: -2.89,
    volume24h: 123460000
  },
  {
    id: 'ethereum',
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    image: '/images/crypto/eth.svg',
    price: 2119.99,
    change24h: -2.48,
    volume24h: 69530000
  },
  {
    id: 'solana',
    symbol: 'SOL/USDT',
    name: 'Solana',
    image: '/images/crypto/sol.svg',
    price: 179.21,
    change24h: -3.75,
    volume24h: 35790000
  },
  {
    id: 'bnb',
    symbol: 'BNB/USDT',
    name: 'BNB',
    image: '/images/crypto/bnb.svg',
    price: 610.48,
    change24h: -1.22,
    volume24h: 28460000
  },
  {
    id: 'xrp',
    symbol: 'XRP/USDT',
    name: 'XRP',
    image: '/images/crypto/xrp.svg',
    price: 0.5864,
    change24h: -1.98,
    volume24h: 15230000
  }
];

export default function MarketsSection() {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('top');
  const exchangeData = useExchangeData();

  // Получаем изображение для монеты из локальных файлов
  // const getCoinImage = (symbol: string): string => {
  //   const baseCurrency = symbol.split('/')[0].toLowerCase();
  //   // Проверяем, есть ли у нас изображение для этой валюты
  //   return `/images/crypto/${baseCurrency}.svg`;
  // };

  // Transform exchange data to CryptoCoin array
  const cryptoCoins = useMemo(() => {
    if (!exchangeData) return [];

    return Object.entries(exchangeData)
      .map(([symbol, data]) => {
        const lowercaseSymbol = symbol.toLowerCase();
        
        // Преобразуем формат символа (например, btcusdt -> BTC/USDT)
        const formattedSymbol = symbol.replace(/([A-Za-z0-9]+)([A-Za-z0-9]{4})$/, (_, base, quote) => {
          return `${base.toUpperCase()}/${quote.toUpperCase()}`;
        });
        
        const metadata = coinMetadata[lowercaseSymbol] || { 
          name: formattedSymbol.split('/')[0],
          // image: getCoinImage(formattedSymbol),
          volume24h: fallbackCoinData.volume24h
        };
        
        return {
          id: lowercaseSymbol,
          symbol: formattedSymbol,
          name: metadata.name,
          image: metadata.image,
          //@ts-ignore
          price: parseFloat(data.price),
                    //@ts-ignore

          change24h: parseFloat(data.change24h),
          volume24h: metadata.volume24h
        };
      });
  }, [exchangeData]);

  // Фильтрация данных на основе активной вкладки
  const filteredCoins = useMemo(() => {
    if (cryptoCoins.length === 0) return fallbackData;
    
    switch (activeTab) {
      case 'hot': 
        // Сортировка по объему торгов
        return [...cryptoCoins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
      case 'gainers':
        // Сортировка по положительному изменению цены
        return [...cryptoCoins]
          .filter(coin => coin.change24h > 0)
          .sort((a, b) => b.change24h - a.change24h)
          .slice(0, 5);
      case 'losers':
        // Сортировка по отрицательному изменению цены
        return [...cryptoCoins]
          .filter(coin => coin.change24h < 0)
          .sort((a, b) => a.change24h - b.change24h)
          .slice(0, 5);
      case 'new':
        // Просто берем случайные монеты (имитация новых листингов)
        return [...cryptoCoins]
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
      case 'top':
      default:
        // Топ-5 по объему торгов
        return [...cryptoCoins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
    }
  }, [cryptoCoins, activeTab]);

  // Функции форматирования для отображения данных
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else if (price < 10000) {
      return price.toFixed(2);
    } else {
      return formatNumber(parseFloat(price.toFixed(1)));
    }
  };

  // Табы для типов рынков
  const tabs = [
    { id: 'top', label: t('top') },
    { id: 'hot', label: t('hot') },
    { id: 'gainers', label: t('gainers') },
    { id: 'losers', label: t('losers') },
    { id: 'new', label: t('new') }
  ];

  return (
    <section className="py-16 bg-[var(--background)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">{t('markets')}</h2>
          <Link href="/markets" className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
            {t('seeAllMarkets')} 
            <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-4">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id 
                    ? 'border-yellow-500 text-yellow-500' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="pb-4 font-normal">{t('contract')}</th>
                <th className="pb-4 font-normal text-right">{t('lastPrice')}</th>
                <th className="pb-4 font-normal text-right">{t('24hChange')}</th>
                <th className="pb-4 font-normal text-right">{t('volume24h')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id} className="border-t border-gray-800 hover:bg-gray-900/50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 relative">
                        <Image 
                          src={coin.image} 
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="rounded-full object-contain"
                        />
                      </div>
                      <span className="font-medium">{coin.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">{formatPrice(coin.price)}</td>
                  <td className={`py-4 text-right ${
                    coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </td>
                  <td className="py-4 text-right">{formatVolume(coin.volume24h)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}