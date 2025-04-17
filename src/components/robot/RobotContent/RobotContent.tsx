'use client';

import React, { useState, useEffect } from 'react';
import styles from './RobotContent.module.css';
import { robotService, Trade, TradeHistoryParams } from '@/services/robotService';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');
  
  // Check robot status on component mount and when trade type changes
  useEffect(() => {
    checkRobotStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeType]);

  // Fetch trade history on component mount and when page/type changes
  useEffect(() => {
    fetchTradeHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, tradeType, maxPerPage]);

  // Function to check the current robot status from the API
  const checkRobotStatus = async () => {
    try {
      const robotStatus = await robotService.fetchRobotStatus(tradeType);
      setIsRunning(robotStatus);
    } catch (err) {
      console.error('Error checking robot status:', err);
      // Don't show error to user for status check - just use default (false/stopped)
    }
  };

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
      setTradeHistory(data.trades || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching trade history:', err);
      setError(t('failedLoadHistory', 'Failed to load trade history'));
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
             ? `${t('startSuccess', 'Robot started successfully for')} ${tradeType} ${t('account', 'account')}!`
             : `${t('stopSuccess', 'Robot stopped successfully for')} ${tradeType} ${t('account', 'account')}!`;
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
           ? `${t('startSuccess', 'Robot started successfully for')} ${tradeType} ${t('account', 'account')}!`
           : `${t('stopSuccess', 'Robot stopped successfully for')} ${tradeType} ${t('account', 'account')}!`;
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
      setError(err instanceof Error ? err.message : t('failedToggle', 'Failed to toggle robot state'));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
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

  // Format currency for display - with type safety
  const formatCurrency = (amount: number | string | null | undefined) => {
    // Convert to number if needed, and handle null/undefined
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
    
    // Check if it's a valid number
    if (isNaN(numericAmount)) {
      return '0.00 USDT';
    }
    
    return numericAmount.toFixed(2) + ' USDT';
  };

  // Calculate equivalent crypto (this would be based on actual rates in production)
  const calculateEquivCrypto = (investment: number | string | null | undefined, icon: string) => {
    // Convert to number if needed, and handle null/undefined
    const numericInvestment = typeof investment === 'string' ? parseFloat(investment) : (investment || 0);
    
    // Check if it's a valid number
    if (isNaN(numericInvestment)) {
      return 'eq 0 CRYPTO';
    }
    
    // This is a simplified mock calculation
    switch (icon) {
      case 'btc':
        return `eq ${(numericInvestment / 80000).toFixed(6)} BTC`;
      case 'eth':
        return `eq ${(numericInvestment / 3000).toFixed(4)} ETH`;
      case 'ltc':
        return `eq ${(numericInvestment / 70).toFixed(2)} LTC`;
      case 'bnb':
        return `eq ${(numericInvestment / 500).toFixed(4)} BNB`;
      case 'trx':
        return `eq ${(numericInvestment / 0.1).toFixed(1)} TRX`;
      default:
        return `eq ${(numericInvestment / 100).toFixed(2)} CRYPTO`;
    }
  };

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className={styles.pagination}>
        <button 
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          {t('previous', 'Previous')}
        </button>
        
        <span className={styles.pageInfo}>
          {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
        </span>
        
        <button 
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          {t('next', 'Next')}
        </button>
      </div>
    );
  };

  // Toggle between demo and real trading
  const toggleTradeType = () => {
    // Prevent switching accounts if robot is running
    if (isRunning) {
      setError(t('stopBeforeSwitching', 'Please stop the robot before switching accounts'));
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
          <h2 className={styles.title}>{t('tradingRobot', 'Trading Robot')}</h2>
          <p className={styles.subtitle}>
            {t('lastDaysStats', 'Last 30 days our users trading statistics.')}
            {' '}
            <span className={styles.accountBadge}>
              {tradeType === 'demo' ? t('demoAccount', 'Demo Account') : t('realAccount', 'Real Account')}
            </span>
          </p>
        </div>
        
        <div className={styles.actionSection}>
          <button 
            onClick={toggleTradeType} 
            disabled={isRunning}
            className={`${styles.typeToggleButton} ${isRunning ? styles.disabled : ''}`}
          >
            {tradeType === 'demo' ? t('switchToReal', 'Switch to real account') : t('switchToDemo', 'Switch to demo account')}
          </button>
          
          <div className={styles.statusBar}>
            <div className={styles.statusLabel}>
              {t('roboTrade', 'Robo Trade')}:
            </div>
            <div className={`${styles.statusValue} ${isRunning ? styles.running : styles.stopped}`}>
              {isRunning ? t('running', 'Running') : t('stopped', 'Stopped')}
            </div>
            <button 
              className={`${styles.toggleButton} ${isRunning ? styles.stopButton : styles.startButton}`} 
              onClick={toggleRobotState}
              disabled={isTogglingRobot}
            >
              <span className={styles.buttonText}>
                {isTogglingRobot ? '...' : isRunning ? t('stop', 'Stop') : t('start', 'Start')}
              </span>
              <span className={styles.buttonAnimation}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchTradeHistory();
            }} 
            className={styles.retryButton}
          >
            {t('retry', 'Retry')}
          </button>
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className={styles.successMessage}>
          <p>{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)} 
            className={styles.closeButton}
            aria-label={t('close', 'Close')}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* History section */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <h2 className={styles.historyTitle}>{t('tradeHistory', 'Trade History')}</h2>
          
          <div className={styles.historyControls}>
            <select 
              value={maxPerPage}
              onChange={(e) => {
                setMaxPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={styles.pageSizeSelector}
              aria-label={t('perPageSelector', 'Items per page')}
            >
              <option value={5}>5 {t('perPage', 'per page')}</option>
              <option value={10}>10 {t('perPage', 'per page')}</option>
              <option value={20}>20 {t('perPage', 'per page')}</option>
              <option value={50}>50 {t('perPage', 'per page')}</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <span>{t('loadingTrades', 'Loading trades...')}</span>
          </div>
        ) : tradeHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t('noTradeHistory', 'No trade history available')}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className={styles.tableContainer}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>{t('trade', 'Currency/Trade')}</th>
                    <th>{t('status', 'Status')}</th>
                    <th className={styles.hideOnMobile}>{t('investment', 'Investment')}</th>
                    <th className={styles.hideOnTablet}>{t('startingBalance', 'Starting balance')}</th>
                    <th className={styles.hideOnTablet}>{t('endingBalance', 'Ending balance')}</th>
                    <th className={styles.hideOnMobile}>{t('dates', 'Start date / End date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade, index) => {
                    // Determine if trade was profitable
                    const isProfit = trade.status === 'win';
                    
                    // Get investment from data
                    const investment = typeof trade.investment === 'number' 
                      ? trade.investment 
                      : (typeof trade.investment === 'string' ? parseFloat(trade.investment) : 0);
                    
                    return (
                      <tr key={trade.id || index} className={index % 2 === 0 ? styles.evenRow : ''}>
                        <td>
                          <div className={styles.currencyCell}>
                            <div className={`${styles.currencyIcon} ${styles[trade.icon || 'btc']}`}>
                              {/* Icon applied via CSS background */}
                            </div>
                            <div className={styles.tradeInfo}>
                              <div className={styles.tradeId}>#{trade.id || 'N/A'}</div>
                              <div className={styles.tradeDate}>
                                {formatDate(trade.start_date || '')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${isProfit ? styles.profit : styles.loss}`}>
                            {isProfit ? t('profit', 'Profit') : t('loss', 'Loss')}
                          </span>
                        </td>
                        <td className={styles.hideOnMobile}>
                          <div className={styles.investmentCell}>
                            <div>{formatCurrency(investment)}</div>
                            <div className={styles.equivCrypto}>
                              {calculateEquivCrypto(investment, trade.icon || 'btc')}
                            </div>
                          </div>
                        </td>
                        <td className={styles.hideOnTablet}>
                          {formatCurrency(trade.starting_balance)}
                        </td>
                        <td className={styles.hideOnTablet}>
                          {formatCurrency(trade.ending_balance)}
                        </td>
                        <td className={styles.hideOnMobile}>
                          <div className={styles.dateCell}>
                            <div>{formatDate(trade.start_date || '')}</div>
                            <div>{formatDate(trade.end_date || '')}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards for better small screen experience */}
            <div className={styles.mobileCards}>
              {tradeHistory.map((trade, index) => {
                // Determine if trade was profitable
                const isProfit = trade.status === 'win';
                
                // Get investment from data
                const investment = typeof trade.investment === 'number' 
                  ? trade.investment 
                  : (typeof trade.investment === 'string' ? parseFloat(trade.investment) : 0);
                
                return (
                  <div key={trade.id || index} className={styles.mobileCard}>
                    <div className={styles.mobileCardHeader}>
                      <div className={styles.currencyCell}>
                        <div className={`${styles.currencyIcon} ${styles[trade.icon || 'btc']}`}></div>
                        <div className={styles.tradeInfo}>
                          <div className={styles.tradeId}>#{trade.id || 'N/A'}</div>
                          <div className={styles.tradeDate}>{formatDate(trade.start_date || '')}</div>
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${isProfit ? styles.profit : styles.loss}`}>
                        {isProfit ? t('profit', 'Profit') : t('loss', 'Loss')}
                      </span>
                    </div>
                    
                    <div className={styles.mobileCardDetails}>
                      <div className={styles.mobileDetailRow}>
                        <span className={styles.mobileDetailLabel}>{t('investment', 'Investment')}:</span>
                        <span className={styles.mobileDetailValue}>
                          {formatCurrency(investment)} ({calculateEquivCrypto(investment, trade.icon || 'btc')})
                        </span>
                      </div>
                      {trade.starting_balance && (
                        <div className={styles.mobileDetailRow}>
                          <span className={styles.mobileDetailLabel}>{t('startingBalance', 'Starting Balance')}:</span>
                          <span className={styles.mobileDetailValue}>
                            {formatCurrency(trade.starting_balance)}
                          </span>
                        </div>
                      )}
                      {trade.ending_balance && (
                        <div className={styles.mobileDetailRow}>
                          <span className={styles.mobileDetailLabel}>{t('endingBalance', 'Ending Balance')}:</span>
                          <span className={styles.mobileDetailValue}>
                            {formatCurrency(trade.ending_balance)}
                          </span>
                        </div>
                      )}
                      <div className={styles.mobileDetailRow}>
                        <span className={styles.mobileDetailLabel}>{t('period', 'Period')}:</span>
                        <span className={styles.mobileDetailValue}>
                          {formatDate(trade.start_date || '')} - {formatDate(trade.end_date || '')}
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