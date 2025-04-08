'use client';

import React, { useState } from 'react';
import styles from './TradingPairsSelector.module.css';

interface TradingPair {
  id: string;
  base: string;
  quote: string;
  isSelected: boolean;
}

const TradingPairsSelector: React.FC = () => {
  const [pairs, setPairs] = useState<TradingPair[]>([
    { id: '1', base: 'BTC', quote: 'USDT', isSelected: false },
    { id: '2', base: 'ETH', quote: 'USDT', isSelected: true },
    { id: '3', base: 'SOL', quote: 'USDT', isSelected: false },
    { id: '4', base: 'ADA', quote: 'USDT', isSelected: false },
    { id: '5', base: 'DOT', quote: 'USDT', isSelected: false },
    { id: '6', base: 'DOGE', quote: 'USDT', isSelected: false },
    { id: '7', base: 'AVAX', quote: 'USDT', isSelected: false },
    { id: '8', base: 'LINK', quote: 'USDT', isSelected: false },
    { id: '9', base: 'MATIC', quote: 'USDT', isSelected: false },
    { id: '10', base: 'UNI', quote: 'USDT', isSelected: false },
    { id: '11', base: 'ATOM', quote: 'USDT', isSelected: false },
    { id: '12', base: 'LTC', quote: 'USDT', isSelected: false },
    { id: '13', base: 'ALGO', quote: 'USDT', isSelected: false },
    { id: '14', base: 'XRP', quote: 'USDT', isSelected: false },
    { id: '15', base: 'FTM', quote: 'USDT', isSelected: false },
  ]);
  
  const togglePair = (id: string) => {
    setPairs(
      pairs.map(pair => 
        pair.id === id ? { ...pair, isSelected: !pair.isSelected } : pair
      )
    );
  };
  
  const selectedCount = pairs.filter(pair => pair.isSelected).length;
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Trade currencies</h3>
        <div className={styles.selectedCount}>
          {selectedCount} / {pairs.length} Pairs selected
        </div>
      </div>
      
      <div className={styles.pairsGrid}>
        {pairs.map(pair => (
          <div key={pair.id} className={styles.pairItem}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={pair.isSelected}
                onChange={() => togglePair(pair.id)}
                className={styles.toggleInput}
              />
              <div className={styles.toggleTrack}>
                <div className={styles.toggleIndicator}></div>
              </div>
              <span className={styles.pairName}>{pair.base} / {pair.quote}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingPairsSelector;