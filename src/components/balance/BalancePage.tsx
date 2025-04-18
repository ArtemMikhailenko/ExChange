'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/context/ThemeContext';
import Image from 'next/image';
import { Eye, EyeOff, MoreVertical } from 'lucide-react';
import styles from './BalancePage.module.css';
import walletService from '@/services/walletService';

interface BalanceData {
  [key: string]: string;
}

export default function BalancePage() {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [hideBalances, setHideBalances] = useState(false);
  const [activeTab, setActiveTab] = useState('balances');
  const [assetTab, setAssetTab] = useState('assets');
  const [balances, setBalances] = useState<BalanceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate total balance in USD
  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch balances from API
  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      try {
        const data = await walletService.getBalances();
        
        if (data.status === 'success' && data.balances) {
          setBalances(data.balances);
          
          // Calculate total balance - this would typically be provided by the backend
          // but we're calculating it here as a fallback
          let total = 0;
          Object.entries(data.balances).forEach(([currency, amount]) => {
            const numericAmount = parseFloat(amount);
            if (!isNaN(numericAmount)) {
              // Simplified calculation - in a real app, use rates from the backend
              if (currency === 'USDT' || currency === 'USDC') {
                total += numericAmount; // Stablecoins are ~1 USD
              } else {
                total += numericAmount; // For other currencies, assume backend provides USD value
              }
            }
          });
          
          setTotalBalance(total);
        } else {
          setError(data.msg || 'Failed to load balances');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching balances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  // Style classes based on theme
  const containerClass = isDark ? styles.containerDark : styles.containerLight;
  const sidebarClass = isDark ? styles.sidebarDark : styles.sidebarLight;
  const accountBoxClass = isDark ? styles.accountBoxDark : styles.accountBoxLight;
  const textMutedClass = isDark ? styles.textMutedDark : styles.textMutedLight;
  const borderClass = isDark ? styles.borderDark : styles.borderLight;
  const tabButtonClass = isDark ? styles.tabButtonDark : styles.tabButtonLight;
  const tableClass = isDark ? styles.tableDark : styles.tableLight;

  return (
    <div className={containerClass}>
      {/* Account selector & overview */}
      <div className={styles.layout}>
        {/* Left sidebar */}
        <div className={sidebarClass}>
          <div className={styles.accountsHeader}>
            <div className={styles.accountsTitle}>Accounts</div>
            <div className={styles.accountBadge}>1</div>
          </div>
          
          <div className={accountBoxClass}>
            <div className={styles.accountInfo}>
              <div className={styles.accountIcon}>M</div>
              <div className={styles.accountName}>Main</div>
            </div>
            <div className={textMutedClass}>
              ${hideBalances ? '••••' : totalBalance.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className={styles.mainContent}>
          <div className={styles.accountHeader}>
            <div className={styles.accountIconLarge}>M</div>
            <h1 className={styles.pageTitle}>Main</h1>
          </div>
          
          {/* Account balance overview */}
          <div className={styles.balanceOverview}>
            <div className={textMutedClass + ' ' + styles.balanceLabel}>Account balance</div>
            
            <div className={styles.balanceRow}>
              <div className={styles.balanceAmount}>
                ${hideBalances ? '••••' : totalBalance.toFixed(2)}
              </div>
              <div className={textMutedClass + ' ' + styles.balanceChange}>
                {hideBalances ? '••••' : `0.00 $`} {hideBalances ? '••••' : '0.00%'}
              </div>
              <button 
                className={styles.eyeButton}
                onClick={() => setHideBalances(!hideBalances)}
              >
                {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className={styles.statsGrid + ' ' + borderClass}>
              <div className={styles.statItem}>
                <div className={textMutedClass}>Net Equity</div>
                <div>${hideBalances ? '••••' : totalBalance.toFixed(2)}</div>
              </div>
              <div className={styles.statItem}>
                <div className={textMutedClass}>Available Equity</div>
                <div>${hideBalances ? '••••' : totalBalance.toFixed(2)}</div>
              </div>
              <div className={styles.statItem}>
                <div className={textMutedClass}>Open PnL</div>
                <div>${hideBalances ? '••••' : '0.00'}</div>
              </div>
              <div className={styles.statItem}>
                <div className={textMutedClass}>Initial Margin</div>
                <div>{hideBalances ? '••••' : '0%'}</div>
              </div>
              <div className={styles.statItem}>
                <div className={textMutedClass}>Maintenance Margin</div>
                <div>{hideBalances ? '••••' : '0%'}</div>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className={styles.tabsContainer + ' ' + borderClass}>
              <button 
                className={`${tabButtonClass} ${activeTab === 'balances' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('balances')}
              >
                Balances
              </button>
              <button 
                className={`${tabButtonClass} ${activeTab === 'transfers' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('transfers')}
              >
                Transfers
              </button>
              <button 
                className={`${tabButtonClass} ${activeTab === 'trades' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('trades')}
              >
                Trades
              </button>
            </div>

            {/* Assets section */}
            <div className={styles.balancesSection}>
              <h2 className={styles.sectionTitle}>Balances</h2>
              
              <div className={styles.assetTabsContainer}>
                <button 
                  className={`${styles.assetTab} ${assetTab === 'assets' ? styles.activeAssetTab : ''}`}
                  onClick={() => setAssetTab('assets')}
                >
                  Assets
                </button>
              </div>

              <div className={styles.depositButtonContainer}>
                <button className={styles.depositButton}>Cash Deposit</button>
              </div>
              
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading balances...</p>
                </div>
              ) : error ? (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={tableClass}>
                    <thead>
                      <tr>
                        <th className={styles.tableHeader}>Asset</th>
                        <th className={styles.tableHeader}>Total Balance</th>
                        <th className={styles.tableHeader}>Available Balance</th>
                        <th className={styles.tableHeader}>Lend & Borrow</th>
                        <th className={styles.tableHeader}>Open Orders</th>
                        <th className={styles.tableHeader}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(balances).map(([symbol, balance]) => {
                        const numericBalance = parseFloat(balance);
                        
                        return (
                          <tr key={symbol} className={styles.tableRow}>
                            <td className={styles.assetCell}>
                              <div className={styles.assetIcon}>
                                <Image 
                                  src={`https://cdnexchange.ymca.one/${symbol}.png`}
                                  alt={symbol}
                                  width={40}
                                  height={40}
                                  className={styles.cryptoIconImg}
                                />
                              </div>
                              <div className={styles.assetInfo}>
                                <div className={styles.assetName}>{symbol}</div>
                                <div className={styles.assetSymbol}>{symbol}</div>
                              </div>
                            </td>
                            <td className={styles.balanceCell}>
                              <div>{hideBalances ? '0' : balance}</div>
                              <div className={textMutedClass}>
                                ${hideBalances ? '0.00' : numericBalance.toFixed(2)}
                              </div>
                            </td>
                            <td className={styles.balanceCell}>
                              <div>{hideBalances ? '0' : balance}</div>
                              <div className={textMutedClass}>
                                ${hideBalances ? '0.00' : numericBalance.toFixed(2)}
                              </div>
                            </td>
                            <td>0</td>
                            <td>0</td>
                            <td className={styles.actionCell}>
                              <button className={styles.actionButton}>Deposit</button>
                              <button className={styles.actionButton}>Withdraw</button>
                              <button className={styles.menuButton}>
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}