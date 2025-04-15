'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useExchangeData } from '@/hooks/useExchangeData';
import styles from './MarketsSection.module.css';
import { useTranslation } from '@/hooks/useTranslation';

type CryptoCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
};

const coinVolumes: Record<string, number> = {
  btc: 123460000,
  eth: 69530000,
  sol: 35790000,
  bnb: 28460000,
  xrp: 15230000,
  doge: 9875000,
  ada: 8450000,
  avax: 7650000,
  dot: 6540000,
  ltc: 5670000,
  shib: 4980000,
  matic: 4320000,
  uni: 3450000,
  link: 2870000,
  atom: 2340000
};

export default function MarketsSection() {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState('top');
  const exchangeData = useExchangeData();

  const getCoinImageUrl = (symbol: string): string => {
    let baseCurrency;
    
    if (symbol.includes('/')) {
      baseCurrency = symbol.split('/')[0];
    } else {
      baseCurrency = symbol.replace(/usdt$|busd$|usdc$/i, '');
    }
    
    return `https://cdnexchange.ymca.one/${baseCurrency.toUpperCase()}.png`;
  };

  const formatSymbol = (symbol: string): string => {
    if (symbol.includes('/')) {
      return symbol.toUpperCase();
    }
    
    const quoteRegex = /([A-Za-z0-9]+)([A-Za-z0-9]{4})$/;
    return symbol.replace(quoteRegex, (_, base, quote) => {
      return `${base.toUpperCase()}/${quote.toUpperCase()}`;
    });
  };

  const getEstimatedVolume = (symbol: string): number => {
    const base = symbol.toLowerCase().replace(/\/.*$/, '');
    return coinVolumes[base] || Math.floor(Math.random() * 1000000) + 500000;
  };

  const cryptoCoins = useMemo(() => {
    if (!exchangeData) return [];

    return Object.entries(exchangeData)
      .filter(([key]) => typeof key === 'string' && key.length > 0 && !key.startsWith('trading'))
      .map(([symbol, data]) => {
        //@ts-ignore
        if (!data.price || !data.change24h) return null;
        
        const formattedSymbol = formatSymbol(symbol);
        const baseCurrency = formattedSymbol.split('/')[0];
        
        return {
          id: symbol.toLowerCase(),
          symbol: formattedSymbol,
          name: baseCurrency,
          image: getCoinImageUrl(symbol),
          //@ts-ignore
          price: parseFloat(data.price),
          //@ts-ignore
          change24h: parseFloat(data.change24h),
          volume24h: getEstimatedVolume(formattedSymbol)
        };
      })
      .filter(Boolean) as CryptoCoin[];
  }, [exchangeData]);

  const fallbackData: CryptoCoin[] = [
    {
      id: 'btcusdt',
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      image: 'https://cdnexchange.ymca.one/BTC.png',
      price: 83738.1,
      change24h: -2.89,
      volume24h: 123460000
    },
    {
      id: 'ethusdt',
      symbol: 'ETH/USDT',
      name: 'Ethereum',
      image: 'https://cdnexchange.ymca.one/ETH.png',
      price: 2119.99,
      change24h: -2.48,
      volume24h: 69530000
    },
    {
      id: 'solusdt',
      symbol: 'SOL/USDT',
      name: 'Solana',
      image: 'https://cdnexchange.ymca.one/SOL.png',
      price: 179.21,
      change24h: -3.75,
      volume24h: 35790000
    },
    {
      id: 'bnbusdt',
      symbol: 'BNB/USDT',
      name: 'BNB',
      image: 'https://cdnexchange.ymca.one/BNB.png',
      price: 610.48,
      change24h: -1.22,
      volume24h: 28460000
    },
    {
      id: 'xrpusdt',
      symbol: 'XRP/USDT',
      name: 'XRP',
      image: 'https://cdnexchange.ymca.one/XRP.png',
      price: 0.5864,
      change24h: -1.98,
      volume24h: 15230000
    }
  ];

  // Filter coins based on active tab
  const filteredCoins = useMemo(() => {
    if (cryptoCoins.length === 0) return fallbackData;
    
    switch (activeTab) {
      case 'hot': 
        // Sort by trading volume
        return [...cryptoCoins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
      case 'gainers':
        // Sort by positive price change
        return [...cryptoCoins]
          .filter(coin => coin.change24h > 0)
          .sort((a, b) => b.change24h - a.change24h)
          .slice(0, 5);
      case 'losers':
        // Sort by negative price change
        return [...cryptoCoins]
          .filter(coin => coin.change24h < 0)
          .sort((a, b) => a.change24h - b.change24h)
          .slice(0, 5);
      case 'new':
        // Randomly select some coins (simulating new listings)
        return [...cryptoCoins]
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
      case 'top':
      default:
        // Top by trading volume
        return [...cryptoCoins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
    }
  }, [cryptoCoins, activeTab, fallbackData]);

  // Formatting functions
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

  const tabs = [
    { id: 'top', label: t('top' ) },
    { id: 'hot', label: t('hot') },
    { id: 'gainers', label: t('gainers') },
    { id: 'losers', label: t('losers') },
    { id: 'new', label: t('new') }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('markets')}</h2>
          <Link href="/markets" className={styles.viewAllLink}>
            {t('seeAllMarkets')} 
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className={styles.tabsContainer}>
          <nav className={styles.tabsList}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTabButton : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.marketsTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>{t('contract')}</th>
                <th className={`${styles.tableHeader} ${styles.headerAlignRight}`}>{t('lastPrice')}</th>
                <th className={`${styles.tableHeader} ${styles.headerAlignRight}`}>{t('24hChange')}</th>
                <th className={`${styles.tableHeader} ${styles.headerAlignRight} ${styles.volumeHeader}`}>{t('volume24h')}</th>
              </tr>
            </thead>
            <tbody>
              {!exchangeData && cryptoCoins.length === 0 ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={`loading-${index}`} className={`${styles.tableRow} ${styles.loadingRow}`}>
                    <td className={`${styles.tableCell} ${styles.loadingCell}`}>
                      <div className={`${styles.skeletonLoader} ${styles.coinSkeleton}`}></div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.loadingCell} ${styles.alignRight}`}>
                      <div className={`${styles.skeletonLoader} ${styles.priceSkeleton}`}></div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.loadingCell} ${styles.alignRight}`}>
                      <div className={`${styles.skeletonLoader} ${styles.changeSkeleton}`}></div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.loadingCell} ${styles.alignRight} ${styles.volumeCell}`}>
                      <div className={`${styles.skeletonLoader} ${styles.volumeSkeleton}`}></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredCoins.map((coin) => (
                  <tr key={coin.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.coinInfo}>
                        <div className={styles.coinImageContainer}>
                          <Image 
                            src={coin.image} 
                            alt={coin.name}
                            width={32}
                            height={32}
                            className={styles.coinImage}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/crypto/generic.svg';
                            }}
                          />
                        </div>
                        <span className={styles.coinSymbol}>{coin.symbol}</span>
                      </div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.alignRight}`}>
                      {formatPrice(coin.price)}
                    </td>
                    <td className={`${styles.tableCell} ${styles.alignRight} ${coin.change24h >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </td>
                    <td className={`${styles.tableCell} ${styles.alignRight} ${styles.volumeCell}`}>
                      {formatVolume(coin.volume24h)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}