'use client';

import React from 'react';
import { useExchangeData, ExchangeData } from '@/hooks/useExchangeData';

export default function CryptoTicker() {
  const data = useExchangeData();

  // Преобразуем данные в массив (если они уже есть)
  const cryptoPairs = React.useMemo(() => {
    if (!data) return [];
    // Пример: берем только пару SOL/USDT, ADA/USDT и т.д.
    return Object.entries(data).map(([key, value]) => {
      // Преобразуем ключ, например: "solusdt" -> "SOL/USDT"
      const pair =
        key.slice(0, key.length - 5).toUpperCase() +
        '/USDT';
      // Преобразуем change24h в число
      //@ts-ignore
      const change = parseFloat(value.change24h);
      return { pair, change };
    });
  }, [data]);

  if (!data) {
    return <div className="w-full bg-yellow-500 py-2 text-center">Загрузка данных...</div>;
  }

  return (
    <div className="w-full bg-yellow-500 py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {cryptoPairs.map((crypto, index) => (
          <div key={index} className="mx-4 flex items-center">
            <span className="font-medium">{crypto.pair}</span>
            <span
              className={`ml-2 w-16 inline-block text-center ${
                crypto.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ({crypto.change >= 0 ? '+' : ''}{crypto.change}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
