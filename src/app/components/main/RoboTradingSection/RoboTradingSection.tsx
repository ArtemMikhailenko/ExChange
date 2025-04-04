'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useExchangeData } from '@/hooks/useExchangeData';
import styles from './RoboTradingSection.module.css';

export default function RoboTradingSection() {
  const { t } = useTranslation('common');
  const exchangeData = useExchangeData();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create chart from chartData if available
  const createChartSVG = (data?: number[]) => {
    if (!data || data.length < 2) {
      // Default chart path if no data
      return (
        <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 35C20 30 30 25 40 28C50 31 60 34 70 33C80 32 90 28 100 25C110 22 120 20 130 22C140 24 150 30 160 32C170 34 180 30 190 25" 
            stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      );
    }
    
    // Calculate SVG path points
    const width = 200;
    const height = 50;
    const padding = 5;
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    
    // Find min and max to normalize
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Create points
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * availableWidth;
      const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
      const y = height - padding - normalizedValue * availableHeight;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="100%" height="50" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline 
          points={points} 
          stroke="#22C55E" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
      </svg>
    );
  };

  // Trading bots data with fallback
  const tradingBots = useMemo(() => {
    const defaultBots = [
      {
        name: 'AI_TRADE',
        icon: 'https://cdnexchange.ymca.one/AI_TRADE.png',
        performance: '+65.57%',
        period: '30D ROI',
        copiers: 14647,
        chartData: [10, 12, 15, 13, 17, 20, 18, 22, 25]
      },
      {
        name: 'ZenTrader_V1',
        icon: 'https://cdnexchange.ymca.one/ZenTrader.png',
        performance: '+63.98%',
        period: '30D ROI',
        copiers: 2123
      }
    ];

    if (exchangeData && exchangeData.tradingBots && exchangeData.tradingBots.length >= 2) {
      return exchangeData.tradingBots;
    }
    
    return defaultBots;
  }, [exchangeData]);

  // Platform statistics
  const platformStats = [
    {
      value: '17,000+',
      label: t('eliteTraders', 'Elite Traders')
    },
    {
      value: '51M+',
      label: t('copierEarnings', 'Copier Earnings')
    },
    {
      value: '600M+',
      label: t('totalOrders', 'Total Orders')
    }
  ];

  // Mobile version
  if (isMobile) {
    return (
      <section className={styles.mobileSection}>
        <div className={styles.mobileContainer}>
          <h1 className={styles.mobileMainTitle}>
            {t('exploreOurProducts', 'Explore Our Products')}<span className={styles.blueDot}>.</span>
          </h1>
          
          <h2 className={styles.mobileTitle}>
            {t('roboTradingTitle', 'Robo Trading: Invest Less, Earn More')}
          </h2>
          
          <div className={styles.mobileStatsRow}>
            <div className={styles.mobileStatItem}>
              <div className={styles.mobileStatValue}>{platformStats[0].value}</div>
              <div className={styles.mobileStatLabel}>{platformStats[0].label}</div>
            </div>
            <div className={styles.mobileStatItem}>
              <div className={styles.mobileStatValue}>{platformStats[1].value}</div>
              <div className={styles.mobileStatLabel}>{platformStats[1].label}</div>
            </div>
          </div>
          
          <div className={styles.mobileStatsRow}>
            <div className={styles.mobileStatItem}>
              <div className={styles.mobileStatValue}>{platformStats[2].value}</div>
              <div className={styles.mobileStatLabel}>{platformStats[2].label}</div>
            </div>
          </div>
          
          <div className={styles.mobileBotCardContainer}>
            <div className={styles.mobileBotCard}>
              <div className={styles.mobileBotHeader}>
                <div className={styles.mobileBotIconWrapper}>
                  <Image 
                    src={tradingBots[0].icon || 'https://cdnexchange.ymca.one/default.png'} 
                    alt={tradingBots[0].name}
                    width={24} 
                    height={24}
                    className={styles.mobileBotIcon}
                  />
                </div>
                <span className={styles.mobileBotName}>{tradingBots[0].name}</span>
              </div>
              
              <div className={styles.mobilePerfContainer}>
                <div className={styles.mobilePerformanceValue}>{tradingBots[0].performance}</div>
                <div className={styles.mobilePerformancePeriod}>{tradingBots[0].period}</div>
              </div>
              
              <div className={styles.mobileChartContainer}>
                {createChartSVG(tradingBots[0].chartData)}
              </div>
              
              <div className={styles.mobileBotFooter}>
                <div className={styles.mobileCopiersInfo}>
                  <span className={styles.mobileCopiersCount}>{tradingBots[0].copiers.toLocaleString()}</span>
                  <span className={styles.mobileCopiersLabel}>{t('copiers', 'Copiers')}</span>
                </div>
                
                <button className={styles.mobileCopyButton}>
                  {t('copy', 'Copy')}
                </button>
              </div>
            </div>
          </div>
          
          <Link href="/robo-trading" className={styles.mobileLearnMoreButton}>
            {t('learnMore', 'Learn More')} <span className={styles.mobileRightArrow}>›</span>
          </Link>
        </div>
      </section>
    );
  }

  // Desktop version
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          {/* Left column with title and statistics */}
          <div className={styles.leftColumn}>
            <h2 className={styles.title}>
              {t('roboTradingTitle', 'Robo Trading: Invest Less, Earn More')}
            </h2>
            
            <div className={styles.statsGrid}>
              {platformStats.map((stat, index) => (
                <div key={index}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
            
            <Link href="/robo-trading" className={styles.learnMoreButton}>
              {t('learnMore', 'Learn More')} ›
            </Link>
          </div>
          
          {/* Right column with bot cards */}
          <div className={styles.rightColumn}>
            <div className={styles.botsContainer}>
              {/* First bot card */}
              <div className={styles.botCard}>
                <div className={styles.botIdentity}>
                  <div className={styles.botIconWrapper}>
                    <Image 
                      src={tradingBots[0].icon || 'https://cdnexchange.ymca.one/default.png'} 
                      alt={tradingBots[0].name} 
                      width={32} 
                      height={32} 
                      className={styles.botIcon}
                    />
                  </div>
                  <span className={styles.botName}>{tradingBots[0].name}</span>
                </div>
                <div className={styles.blockPerformance}>
                    <div className={styles.botPerformance}>
                      <span className={styles.performanceValue}>{tradingBots[0].performance}</span>
                      <span className={styles.performancePeriod}>{tradingBots[0].period}</span>
                    </div>
                    
                    <div className={styles.chartContainer}>
                      {createChartSVG(tradingBots[0].chartData)}
                    </div>
                </div>
                
                
                <div className={styles.botFooter}>
                  <div className={styles.copiersInfo}>
                    <span className={styles.copiersCount}>{tradingBots[0].copiers.toLocaleString()}</span>
                    <span className={styles.copiersLabel}>{t('copiers', 'Copiers')}</span>
                  </div>
                  
                  <button className={styles.copyButton}>
                    {t('copy', 'Copy')}
                  </button>
                </div>
              </div>
              
              {/* Second bot card */}
              <div className={styles.botCardSecondary}>
                <div className={styles.botIdentity}>
                  <div className={styles.botIconWrapper}>
                    <Image 
                      src={tradingBots[1].icon || 'https://cdnexchange.ymca.one/default.png'} 
                      alt={tradingBots[1].name} 
                      width={32} 
                      height={32} 
                      className={styles.botIcon}
                    />
                  </div>
                  <span className={styles.botName}>{tradingBots[1].name}</span>
                </div>
                
                <div className={styles.botPerformance}>
                  <span className={styles.performanceValue}>{tradingBots[1].performance}</span>
                  <span className={styles.performancePeriod}>{tradingBots[1].period}</span>
                </div>
                
                <div className={styles.copiersInfo}>
                  <span className={styles.copiersCount}>{tradingBots[1].copiers.toLocaleString()}</span>
                  <span className={styles.copiersLabel}>{t('copiers', 'Copiers')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}