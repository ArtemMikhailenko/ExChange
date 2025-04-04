'use client';

import React from 'react';
import { useExchangeData } from '@/hooks/useExchangeData';

export default function CryptoTicker() {
  const data = useExchangeData();

  const cryptoPairs = React.useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .filter(([key]) => key !== 'tradingBots') 
      .map(([key, value]) => {
        const pair = key.slice(0, key.length - 5).toUpperCase() + '/USDT';
        //@ts-ignore
        const change = parseFloat(value.change24h);
        return { pair, change };
      });
  }, [data]);

  if (!data) {
    return (
      <div className="w-full bg-yellow-500 py-2 text-center">
        Загрузка данных...
      </div>
    );
  }

  const duplicatedPairs = [...cryptoPairs, ...cryptoPairs, ...cryptoPairs];

  return (
    <div className="w-full bg-yellow-500 py-2 overflow-hidden border border-red-400 border-opacity-70 shadow-[0_0_4px_rgba(255,0,0,0.3)]">
      <div className="ticker-container">
        <div className="ticker-track">
          {duplicatedPairs.map((crypto, index) => (
            <div key={index} className="mx-4 inline-flex items-center w-[150px]">
              <span className="font-medium">{crypto.pair}</span>
              <span
                className={`ml-2 ${
                  crypto.change >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}
              >
                ({crypto.change >= 0 ? '+' : ''}{crypto.change}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ticker-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker 130s linear infinite;
        }
        
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  );
}