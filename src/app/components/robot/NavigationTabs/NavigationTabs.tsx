import React from 'react';
import styles from './NavigationTabs.module.css';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.tabs}>
      <div className={styles.tabItem}>
        <div className={styles.tabIcon}>🔥</div>
        <button 
          className={`${styles.tabButton} ${activeTab === 'robot' ? styles.active : ''}`}
          onClick={() => onTabChange('robot')}
        >
          Robot
        </button>
      </div>

      <div className={styles.tabItem}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'configuration' ? styles.active : ''}`}
          onClick={() => onTabChange('configuration')}
        >
          Configuration
        </button>
      </div>

      <div className={styles.tabItem}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'license' ? styles.active : ''}`}
          onClick={() => onTabChange('license')}
        >
          Buy License
        </button>
      </div>
    </nav>
  );
};

export default NavigationTabs;