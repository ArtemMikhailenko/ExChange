'use client';

import React, { useState } from 'react';
import styles from './RobotContent.module.css';

interface Trade {
  id: string;
  icon: string;
  date: string;
  status: 'profit' | 'loss';
  investment: string;
  equivalentCrypto: string;
  startingBalance: string;
  endingBalance: string;
  openingPrice: string;
  closingPrice: string;
  startDate: string;
  endDate: string;
}

const RobotContent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  
  const toggleRobotState = () => {
    const button = document.querySelector(`.${styles.toggleButton}`);
    
    if (button) {
      button.classList.add(styles.animating);
      
      setTimeout(() => {
        button.classList.remove(styles.animating);
        setIsRunning(!isRunning);
      }, 300);
    } else {
      setIsRunning(!isRunning);
    }
  };
  
  const tradeHistory: Trade[] = [
    {
      id: '#923',
      icon: 'trx',
      date: 'Sun Nov 26 2023 11:46',
      status: 'loss',
      investment: '25.00 USDT',
      equivalentCrypto: 'eq 119 TRX',
      startingBalance: '500.00 USDT',
      endingBalance: '475.00 USDT',
      openingPrice: '0.21',
      closingPrice: '0.25',
      startDate: '10:00:31 22.03.25',
      endDate: '15:01:25 22.03.25'
    },
    {
      id: '#923',
      icon: 'ltc',
      date: 'Sun Nov 26 2023 11:46',
      status: 'profit',
      investment: '25.00 USDT',
      equivalentCrypto: 'eq 0.1 LTC',
      startingBalance: '475.00 USDT',
      endingBalance: '500.00 USDT',
      openingPrice: '141',
      closingPrice: '150',
      startDate: '10:00:31 22.03.25',
      endDate: '15:01:25 22.03.25'
    },
    {
      id: '#923',
      icon: 'bnb',
      date: 'Sun Nov 26 2023 11:46',
      status: 'loss',
      investment: '25.00 USDT',
      equivalentCrypto: 'eq 0.0001 BNB',
      startingBalance: '500.00 USDT',
      endingBalance: '475.00 USDT',
      openingPrice: '501.5',
      closingPrice: '601',
      startDate: '10:00:31 22.03.25',
      endDate: '15:01:25 22.03.25'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Trading Robot</h2>
          <p className={styles.subtitle}>Last 30 days our users trading statistics.</p>
        </div>
        
        <div className={styles.actionSection}>
          <a href="#" className={styles.viewLink}>
            View
            <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          
          <div className={styles.statusBar}>
            <div className={styles.statusLabel}>
              Robo Trade:
            </div>
            <div className={`${styles.statusValue} ${isRunning ? styles.running : styles.stopped}`}>
              {isRunning ? 'Running' : 'Stopped'}
            </div>
            <button 
              className={`${styles.toggleButton} ${isRunning ? styles.stopButton : styles.startButton}`} 
              onClick={toggleRobotState}
            >
              <span className={styles.buttonText}>
                {isRunning ? 'Stop' : 'Start'}
              </span>
              <span className={styles.buttonAnimation}></span>
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.historySection}>
        <h2 className={styles.historyTitle}>Trade History</h2>
        
        <div className={styles.tableContainer}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Currency / Trade</th>
                <th>Status</th>
                <th className={styles.hideOnMobile}>Investment</th>
                <th className={styles.hideOnTablet}>Starting balance</th>
                <th className={styles.hideOnTablet}>Ending balance</th>
                <th className={styles.hideOnMobile}>Opening / Closing price</th>
                <th className={styles.hideOnMobile}>Start / End date</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade, index) => (
                <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
                  <td>
                    <div className={styles.currencyCell}>
                      <div className={`${styles.currencyIcon} ${styles[trade.icon]}`}>
                        {/* Icon will be applied via CSS background */}
                      </div>
                      <div className={styles.tradeInfo}>
                        <div className={styles.tradeId}>{trade.id}</div>
                        <div className={styles.tradeDate}>{trade.date}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[trade.status]}`}>
                      {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </span>
                  </td>
                  <td className={styles.hideOnMobile}>
                    <div className={styles.investmentCell}>
                      <div>{trade.investment}</div>
                      <div className={styles.equivCrypto}>{trade.equivalentCrypto}</div>
                    </div>
                  </td>
                  <td className={styles.hideOnTablet}>{trade.startingBalance}</td>
                  <td className={styles.hideOnTablet}>{trade.endingBalance}</td>
                  <td className={styles.hideOnMobile}>{trade.openingPrice} / {trade.closingPrice}</td>
                  <td className={styles.hideOnMobile}>
                    <div className={styles.dateCell}>
                      <div>{trade.startDate}</div>
                      <div>{trade.endDate}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.mobileCards}>
            {tradeHistory.map((trade, index) => (
              <div key={index} className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <div className={styles.currencyCell}>
                    <div className={`${styles.currencyIcon} ${styles[trade.icon]}`}></div>
                    <div className={styles.tradeInfo}>
                      <div className={styles.tradeId}>{trade.id}</div>
                      <div className={styles.tradeDate}>{trade.date}</div>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[trade.status]}`}>
                    {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                  </span>
                </div>
                
                <div className={styles.mobileCardDetails}>
                  <div className={styles.mobileDetailRow}>
                    <span className={styles.mobileDetailLabel}>Investment:</span>
                    <span className={styles.mobileDetailValue}>{trade.investment} ({trade.equivalentCrypto})</span>
                  </div>
                  <div className={styles.mobileDetailRow}>
                    <span className={styles.mobileDetailLabel}>Balance:</span>
                    <span className={styles.mobileDetailValue}>{trade.startingBalance} → {trade.endingBalance}</span>
                  </div>
                  <div className={styles.mobileDetailRow}>
                    <span className={styles.mobileDetailLabel}>Price:</span>
                    <span className={styles.mobileDetailValue}>{trade.openingPrice} → {trade.closingPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotContent;