import React from 'react';
import styles from './NavigationTabs.module.css';
import { useTranslation } from '@/hooks/useTranslation';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
    const { t, lang } = useTranslation();
  
  return (
    <nav className={styles.tabs}>
      <div className={styles.tabItem}>
        <div className={styles.tabIcon}>🔥</div>
        <button 
          className={`${styles.tabButton} ${activeTab === 'robot' ? styles.active : ''}`}
          onClick={() => onTabChange('robot')}
        >
          {t('tab.robot')}
        </button>
      </div>

      <div className={styles.tabItem}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'configuration' ? styles.active : ''}`}
          onClick={() => onTabChange('configuration')}
        >
            {t('tab.configuration')}
        </button>
      </div>

      <div className={styles.tabItem}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'license' ? styles.active : ''}`}
          onClick={() => onTabChange('license')}
        >
            {t('tab.license')}
        </button>
      </div>
    </nav>
  );
};

export default NavigationTabs;