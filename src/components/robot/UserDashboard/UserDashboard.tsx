// src/components/RoboTrading/UserDashboard/UserDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './UserDashboard.module.css';
import { useTranslation } from '@/hooks/useTranslation';

interface UserStatistics {
  total_assets: number;
  total_realized_pnp: number;
}

const UserDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<UserStatistics>({
    total_assets: 0,
    total_realized_pnp: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useTranslation();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Make POST request to the statistics endpoint
        const response = await fetch('https://virtserver.swaggerhub.com/woronaweb/ExChange/1.0.0/api/statistics/robot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setStatistics({
            total_assets: data.total_assets,
            total_realized_pnp: data.total_realized_pnp
          });
        } else {
          throw new Error(data.msg || 'Failed to fetch statistics');
        }
      } catch (err) {
        console.error('Error fetching robot statistics:', err);
        setError('Could not load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Format number with commas for thousands
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className={styles.userCard}>
      <div className={styles.userHead}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img src="/images/robot/avatar-placeholder.svg" alt="User" />
          </div>
          <span className={styles.username}>{t('robot.username')}</span>
        </div>
        
        <div className={styles.tradesLink}>
          <span>My Trades</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <div className={styles.stats}>
        {loading ? (
          <div className={styles.loading}>{t('robot.loadingStats')}</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.statItem}>
              <h3 className={styles.statValue}>
                {formatNumber(statistics.total_assets)}
              </h3>
              <p className={styles.statLabel}>{t('robot.totalAssets')}</p>
            </div>
            <div className={styles.statItem}>
              <h3 className={styles.statValue}>
                {formatNumber(statistics.total_realized_pnp)}
              </h3>
              <p className={styles.statLabel}>{t('robot.totalPnL')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;