'use client';

import React, { useState, useEffect } from 'react';
import styles from './RobotContent.module.css';
import { robotService, Trade, TradeHistoryParams } from '@/services/robotService';
import { useTranslation } from '@/hooks/useTranslation';

const RobotContent: React.FC = () => {
  // State management
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tradeType, setTradeType] = useState<'demo' | 'real'>('demo');
  const [maxPerPage, setMaxPerPage] = useState(10);
  const [isTogglingRobot, setIsTogglingRobot] = useState(false);
  const { t, lang } = useTranslation();
  // Fetch trade history on component mount and when page/type changes
  useEffect(() => {
    fetchTradeHistory();
  }, [currentPage, tradeType, maxPerPage]);

  const fetchTradeHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: TradeHistoryParams = {
        type: tradeType,
        page: currentPage,
        max_on_page: maxPerPage
      };

      const data = await robotService.fetchTradeHistory(params);
      setTradeHistory(data.trades);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Error fetching trade history:', err);
      setError(t('robot.failedLoadHistory'));
    } finally {
      setLoading(false);
    }
  };

  const toggleRobotState = async () => {
    const button = document.querySelector(`.${styles.toggleButton}`);
    
    // Add animation class if button exists
    if (button) {
      button.classList.add(styles.animating);
    }
    
    try {
      setIsTogglingRobot(true);
      setError(null); // Clear any previous errors
      setSuccessMessage(null); // Clear any previous success messages
      
      // Call the API to toggle robot state with the current account type
      const newState = await robotService.toggleRobotState(isRunning, tradeType);
      
      // Handle UI updates
      if (button) {
        setTimeout(() => {
          button.classList.remove(styles.animating);
          setIsRunning(newState);
          setIsTogglingRobot(false);
          
          // Show success message
          const message = newState 
            ? `${t('robot.startSuccess')} ${tradeType} ${t('robot.account')}!` 
            : `${t('robot.stopSuccess')} ${tradeType} ${t('robot.account')}!`;
          setSuccessMessage(message);
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        }, 300);
      } else {
        setIsRunning(newState);
        setIsTogglingRobot(false);
        
        // Show success message
        const message = newState 
          ? `${t('robot.startSuccess')} ${tradeType} ${t('robot.account')}!` 
          : `${t('robot.stopSuccess')} ${tradeType} ${t('robot.account')}!`;
        setSuccessMessage(message);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
      
      // Refresh trade history after toggling robot state
      fetchTradeHistory();
      
    } catch (err) {
      console.error('Error toggling robot state:', err);
      
      // Clean up animation if it exists
      if (button) {
        button.classList.remove(styles.animating);
      }
      
      setIsTogglingRobot(false);
      
      // Show error message to user
      setError(err instanceof Error ? err.message : t('robot.failedToggle'));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (err) {
      return dateString; // Return original if parsing fails
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + ' USDT';
  };

  // Calculate equivalent crypto (this would be based on actual rates in production)
  const calculateEquivCrypto = (investment: number, icon: string) => {
    // This is a simplified mock calculation
    switch (icon) {
      case 'btc':
        return `eq ${(investment / 80000).toFixed(6)} BTC`;
      case 'eth':
        return `eq ${(investment / 3000).toFixed(4)} ETH`;
      case 'ltc':
        return `eq ${(investment / 70).toFixed(2)} LTC`;
      case 'bnb':
        return `eq ${(investment / 500).toFixed(4)} BNB`;
      case 'trx':
        return `eq ${(investment / 0.1).toFixed(1)} TRX`;
      default:
        return `eq ${(investment / 100).toFixed(2)} CRYPTO`;
    }
  };

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className={styles.pagination}>
        <button 
          className={styles.pageButton}
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          {t('robot.previous')}
        </button>
        
        <span className={styles.pageInfo}>
          {t('robot.page')} {currentPage} {t('robot.of')} {totalPages}
        </span>
        
        <button 
          className={styles.pageButton}
          disabled={currentPage === totalPages || loading}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          {t('robot.next')}
        </button>
      </div>
    );
  };

  // Toggle between demo and real trading
  const toggleTradeType = () => {
    // Prevent switching accounts if robot is running
    if (isRunning) {
      setError(t('robot.stopBeforeSwitching'));
      return;
    }
    
    setSuccessMessage(null); // Clear any existing success messages
    setTradeType(prevType => prevType === 'demo' ? 'real' : 'demo');
    setCurrentPage(1); // Reset to first page when switching types
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{t('robot.tradingRobot')}</h2>
          <p className={styles.subtitle}>
            {t('robot.lastDaysStats')} {tradeType === 'demo' ? t('robot.demoAccount') : t('robot.realAccount')}.
          </p>
        </div>
        
        <div className={styles.actionSection}>
          <button 
            onClick={toggleTradeType} 
            className={styles.typeToggle}
            aria-label={tradeType === 'demo' ? t('robot.switchToReal') : t('robot.switchToDemo')}
          >
            {tradeType === 'demo' ? t('robot.switchToReal') : t('robot.switchToDemo')}
          </button>
          
          <div className={styles.statusBar}>
            <div className={styles.statusLabel}>
              {t('robot.roboTrade')}:
            </div>
            <div className={`${styles.statusValue} ${isRunning ? styles.running : styles.stopped}`}>
              {isRunning ? t('robot.running') : t('robot.stopped')}
            </div>
            <button 
              className={`${styles.toggleButton} ${isRunning ? styles.stopButton : styles.startButton}`} 
              onClick={toggleRobotState}
              disabled={isTogglingRobot}
              aria-label={isRunning ? t('robot.stop') : t('robot.start')}
            >
              <span className={styles.buttonText}>
                {isTogglingRobot ? '...' : isRunning ? t('robot.stop') : t('robot.start')}
              </span>
              <span className={styles.buttonAnimation}></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button 
            onClick={fetchTradeHistory} 
            className={styles.retryButton}
            aria-label={t('robot.retry')}
          >
            {t('robot.retry')}
          </button>
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className={styles.successMessage}>
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)} 
            className={styles.closeButton}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* History section */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <h2 className={styles.historyTitle}>{t('robot.tradeHistory')}</h2>
          
          <div className={styles.historyControls}>
            <select 
              value={maxPerPage}
              onChange={(e) => {
                setMaxPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={styles.pageSizeSelector}
              aria-label={t('robot.perPageSelector')}
            >
              <option value={5}>5 {t('robot.perPage')}</option>
              <option value={10}>10 {t('robot.perPage')}</option>
              <option value={20}>20 {t('robot.perPage')}</option>
              <option value={50}>50 {t('robot.perPage')}</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <span>{t('robot.loadingTrades')}</span>
          </div>
        ) : tradeHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t('robot.noTradeHistory')}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className={styles.tableContainer}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>{t('robot.trade')}</th>
                    <th>{t('status')}</th>
                    <th className={styles.hideOnMobile}>{t('robot.investment')}</th>
                    <th className={styles.hideOnTablet}>{t('robot.profit')}</th>
                    <th className={styles.hideOnTablet}>{t('robot.pnl')}</th>
                    <th className={styles.hideOnMobile}>{t('robot.dates')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade, index) => {
                    const profit = trade.profit;
                    const profitPercentage = ((profit / trade.investment) * 100).toFixed(2);
                    const isProfit = trade.status === 'win' || profit > 0;
                    
                    return (
                      <tr key={trade.id} className={index % 2 === 0 ? styles.evenRow : ''}>
                        <td>
                          <div className={styles.currencyCell}>
                            <div className={`${styles.currencyIcon} ${styles[trade.icon || 'btc']}`}>
                              {/* Icon applied via CSS background */}
                            </div>
                            <div className={styles.tradeInfo}>
                              <div className={styles.tradeId}>#{trade.id}</div>
                              <div className={styles.tradeDate}>
                                {formatDate(trade.start_date)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${isProfit ? styles.profit : styles.loss}`}>
                            {isProfit ? t('robot.profit') : t('robot.loss')}
                          </span>
                        </td>
                        <td className={styles.hideOnMobile}>
                          <div className={styles.investmentCell}>
                            <div>{formatCurrency(trade.investment)}</div>
                            <div className={styles.equivCrypto}>
                              {calculateEquivCrypto(trade.investment, trade.icon || 'btc')}
                            </div>
                          </div>
                        </td>
                        <td className={styles.hideOnTablet}>
                          {formatCurrency(Math.abs(profit))}
                        </td>
                        <td className={styles.hideOnTablet}>
                          <span className={isProfit ? styles.profitText : styles.lossText}>
                            {isProfit ? '+' : '-'}{profitPercentage}%
                          </span>
                        </td>
                        <td className={styles.hideOnMobile}>
                          <div className={styles.dateCell}>
                            <div>{t('start')}: {formatDate(trade.start_date)}</div>
                            <div>{t('end')}: {formatDate(trade.end_date)}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className={styles.mobileCards}>
              {tradeHistory.map((trade) => {
                const profit = trade.profit;
                const profitPercentage = ((profit / trade.investment) * 100).toFixed(2);
                const isProfit = trade.status === 'win' || profit > 0;
                
                return (
                  <div key={trade.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardHeader}>
                      <div className={styles.currencyCell}>
                        <div className={`${styles.currencyIcon} ${styles[trade.icon || 'btc']}`}></div>
                        <div className={styles.tradeInfo}>
                          <div className={styles.tradeId}>#{trade.id}</div>
                          <div className={styles.tradeDate}>{formatDate(trade.start_date)}</div>
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${isProfit ? styles.profit : styles.loss}`}>
                        {isProfit ? t('robot.profit') : t('robot.loss')}
                      </span>
                    </div>
                    
                    <div className={styles.mobileCardDetails}>
                      <div className={styles.mobileDetailRow}>
                        <span className={styles.mobileDetailLabel}>{t('robot.investment')}:</span>
                        <span className={styles.mobileDetailValue}>
                          {formatCurrency(trade.investment)} ({calculateEquivCrypto(trade.investment, trade.icon || 'btc')})
                        </span>
                      </div>
                      <div className={styles.mobileDetailRow}>
                        <span className={styles.mobileDetailLabel}>{t('robot.pnl')}:</span>
                        <span className={`${styles.mobileDetailValue} ${isProfit ? styles.profitText : styles.lossText}`}>
                          {isProfit ? '+' : '-'}{formatCurrency(Math.abs(profit))} ({profitPercentage}%)
                        </span>
                      </div>
                      <div className={styles.mobileDetailRow}>
                        <span className={styles.mobileDetailLabel}>{t('period')}:</span>
                        <span className={styles.mobileDetailValue}>
                          {formatDate(trade.start_date)} - {formatDate(trade.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default RobotContent;