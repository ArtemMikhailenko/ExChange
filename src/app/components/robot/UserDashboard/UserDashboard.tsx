import React from 'react';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  return (
    <div className={styles.userCard}>
      <div className={styles.userHead}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img src="/images/robot/avatar-placeholder.svg" alt="User" />
          </div>
          <span className={styles.username}>Username</span>
        </div>
        
        <div className={styles.tradesLink}>
          <span>My Trades</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Total Asset (USDT)</p>
        </div>
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Total Realized P&L (USDT)</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;