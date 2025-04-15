'use client';

import React, { useState } from 'react';
import styles from './ConfigurationPanel.module.css';
import TradingPairsSelector from '../TradingPairsSelector/TradingPairsSelector';
import CryptoHeatmapWidget from '../CryptoHeatmapWidget/CryptoHeatmapWidget';
import MarketOverviewWidget from '../MarketOverviewWidget/MarketOverviewWidget';
import { robotService } from '@/services/robotService';
import { useTranslation } from '@/hooks/useTranslation';

const ConfigurationPanel: React.FC = () => {
  const { t } = useTranslation();
  // State for license key input
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'none';
  }>({
    message: '',
    type: 'none'
  });

  // Handle license key input change
  const handleLicenseKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicenseKey(e.target.value);
    // Reset activation status when input changes
    if (activationStatus.type !== 'none') {
      setActivationStatus({ message: '', type: 'none' });
    }
  };

  // Handle license key activation
  const handleActivateKey = async () => {
    // Validate input
    if (!licenseKey.trim()) {
      setActivationStatus({
        message: t('config.pleaseEnterKey'),
        type: 'error'
      });
      return;
    }

    try {
      setIsActivating(true);
      setActivationStatus({ message: '', type: 'none' });

      // Call the API to activate the key
      const result = await robotService.activateRobotKey(licenseKey.trim());

      // Set activation status based on result
      setActivationStatus({
        message: result.message,
        type: result.success ? 'success' : 'error'
      });

      // Clear input on success
      if (result.success) {
        setLicenseKey('');
      }
    } catch (error) {
      console.error('Error activating license key:', error);
      setActivationStatus({
        message: t('config.activationFailed'),
        type: 'error'
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className={styles.configurationContent}>
      <h2 className={styles.sectionTitle}>{t('config.sectionTitle')}</h2>
      
      <div className={styles.licenseSection}>
        <div className={styles.licenseForm}>
          <input
            type="text"
            placeholder={t('config.enterLicensePlaceholder')}
            className={styles.licenseInput}
            value={licenseKey}
            onChange={handleLicenseKeyChange}
            disabled={isActivating}
            aria-label={t('config.enterLicensePlaceholder')}
          />
          <button 
            className={styles.saveButton}
            onClick={handleActivateKey}
            disabled={isActivating || !licenseKey.trim()}
            aria-label={t('config.activate')}
          >
            {isActivating ? t('config.activating') : t('config.activate')}
          </button>
        </div>
        
        {activationStatus.type !== 'none' && (
          <div className={`${styles.activationMessage} ${styles[activationStatus.type]}`}>
            {activationStatus.message}
          </div>
        )}
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
