'use client';

import { useEffect, useState } from 'react';

export type TradingBotData = {
  name: string;
  icon?: string;
  performance: string;
  period: string;
  copiers: number;
  chartData?: number[];
};

export type ExchangeData = {
  [symbol: string]: {
    price: string;
    change24h: string;
  };
  tradingBots?: TradingBotData[];
};

export function useExchangeData() {
  const [data, setData] = useState<ExchangeData | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://exchange.ymca.one');
    
    ws.onopen = () => {
      console.log('WebSocket подключен к exchange.ymca.one');
      
      // Запрашиваем данные для конкретных пар и данные ботов
      try {
        ws.send(JSON.stringify({
          action: 'subscribe',
          pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'],
          tradingBots: true
        }));
      } catch (error) {
        console.error('Ошибка при отправке запроса', error);
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        console.log('Получены данные с WebSocket:', Object.keys(json).length);
        
        // Если в данных есть информация о ботах, преобразуем ее в нужный формат
        if (json.tradingBots) {
          const tradingBotsData = json.tradingBots.map((bot: any) => ({
            name: bot.name,
            icon: bot.icon || undefined,
            performance: bot.performance,
            period: bot.period || '30D ROI',
            copiers: bot.copiers,
            chartData: bot.chartData
          }));
          
          // Добавляем данные ботов к остальным данным
          json.tradingBots = tradingBotsData;
        }
        
        setData(json);
      } catch (error) {
        console.error('Ошибка парсинга данных', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('Ошибка WebSocket соединения', error);
    };
    
    ws.onclose = (event) => {
      console.log(`WebSocket соединение закрыто: ${event.code} ${event.reason}`);
    };

    return () => {
      ws.close();
    };
  }, []);

  return data;
}