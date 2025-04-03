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
  //@ts-ignore
  tradingBots?: TradingBotData[];
};

export function useExchangeData() {
  const [data, setData] = useState<ExchangeData | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://exchange.ymca.one');
    
    ws.onopen = () => {
      console.log('WebSocket connected to exchange.ymca.one');
      
      // Request data for specific pairs and trading bots
      try {
        ws.send(JSON.stringify({
          action: 'subscribe',
          pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT'],
          tradingBots: true
        }));
      } catch (error) {
        console.error('Error sending request', error);
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        // console.log('Received WebSocket data:', Object.keys(json).length);
        
        // If data contains trading bots info, transform it to the required format
        if (json.tradingBots) {
          const tradingBotsData = json.tradingBots.map((bot: any) => {
            // Replace bot icon URLs with CDN URLs if they don't already use the CDN
            let iconUrl = bot.icon;
            if (iconUrl && !iconUrl.includes('cdnexchange.ymca.one')) {
              // Extract icon name from path and use CDN URL
              const iconName = iconUrl.split('/').pop()?.split('.')[0];
              if (iconName) {
                iconUrl = `https://cdnexchange.ymca.one/${iconName}.png`;
              }
            }
            
            return {
              name: bot.name,
              icon: iconUrl,
              performance: bot.performance,
              period: bot.period || '30D ROI',
              copiers: bot.copiers,
              chartData: bot.chartData
            };
          });
          
          // Add trading bots data to the rest of the data
          json.tradingBots = tradingBotsData;
        }
        
        setData(json);
      } catch (error) {
        console.error('Error parsing data', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket connection error', error);
      // Fallback to mock data when WebSocket fails
      provideFallbackData();
    };
    
    ws.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      // Fallback to mock data if WebSocket closes unexpectedly
      if (event.code !== 1000) {
        provideFallbackData();
      }
    };

    // Provide fallback data if WebSocket fails or times out
    const timeoutId = setTimeout(() => {
      if (!data) {
        provideFallbackData();
      }
    }, 5000);

    function provideFallbackData() {
      //@ts-ignore
      const mockData: ExchangeData = {
        'btcusdt': {
          price: '83738.10',
          change24h: '-2.89'
        },
        'ethusdt': {
          price: '2119.99',
          change24h: '-2.48'
        },
        'solusdt': {
          price: '138.42',
          change24h: '+1.75'
        },
        'adausdt': {
          price: '0.451',
          change24h: '-0.92'
        },
        'dogeusdt': {
          price: '0.1023',
          change24h: '+3.74'
        },
        tradingBots: [
          {
            name: 'AI_TRADE',
            icon: 'https://cdnexchange.ymca.one/AI_TRADE.png',
            performance: '+65.57%',
            period: '30D ROI',
            copiers: 14647,
            chartData: [10, 12, 15, 18, 20, 19, 22, 24, 22, 25]
          },
          {
            name: 'ZenTrader_V1',
            icon: 'https://cdnexchange.ymca.one/ZenTrader.png',
            performance: '+63.98%',
            period: '30D ROI',
            copiers: 2123
          }
        ]
      };

      setData(mockData);
    }

    return () => {
      clearTimeout(timeoutId);
      ws.close();
    };
  }, []);

  return data;
}