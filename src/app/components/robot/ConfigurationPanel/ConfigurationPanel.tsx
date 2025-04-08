'use client';

import React from 'react';
import styles from './ConfigurationPanel.module.css';
import TradingPairsSelector from '../TradingPairsSelector/TradingPairsSelector';
import CryptoHeatmapWidget from '../CryptoHeatmapWidget/CryptoHeatmapWidget';
import MarketOverviewWidget from '../MarketOverviewWidget/MarketOverviewWidget';

const ConfigurationPanel: React.FC = () => {
  return (
    <div className={styles.configurationContent}>
      <h2 className={styles.sectionTitle}>Configuration</h2>
      <div className={styles.licenseForm}>
        <input 
          type="text" 
          placeholder="Enter License Key" 
          className={styles.licenseInput}
        />
        <button className={styles.saveButton}>Save</button>
      </div>
      
      <div className={styles.configSection}>
        <TradingPairsSelector />
      </div>
      
      <div className={styles.configSection}>
        <MarketOverviewWidget/>
      </div>
      <div className={styles.configSection}>
        <CryptoHeatmapWidget/>
      </div>
      
      
    </div>
  );
};

export default ConfigurationPanel;