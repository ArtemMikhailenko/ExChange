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
      <div className="w-full bg-yellow-500 py-2 text-center animate-pulse shadow-[0_0_15px_rgba(255,200,0,0.7)]">
        Загрузка данных...
      </div>
    );
  }

  const duplicatedPairs = [...cryptoPairs, ...cryptoPairs, ...cryptoPairs];

  return (
    <div className="w-full bg-yellow-500 py-2 overflow-hidden relative shadow-[0_0_20px_rgba(255,200,0,0.6)]">
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30 animate-pulse-slow pointer-events-none"></div>
      
      <div className="ticker-container relative z-10">
        <div className="ticker-track">
          {duplicatedPairs.map((crypto, index) => (
            <div key={index} className="mx-4 inline-flex items-center w-[150px] group">
              <span className="font-medium group-hover:text-white transition-colors duration-300">
                {crypto.pair}
              </span>
              <span
                className={`ml-2 ${
                  crypto.change >= 0
                    ? 'text-green-600 glow-green'
                    : 'text-red-600 glow-red'
                } transition-all duration-300 group-hover:font-bold`}
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
        
        .glow-green {
          text-shadow: 0 0 5px rgba(16, 185, 129, 0.7);
        }
        
        .glow-red {
          text-shadow: 0 0 5px rgba(239, 68, 68, 0.7);
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}