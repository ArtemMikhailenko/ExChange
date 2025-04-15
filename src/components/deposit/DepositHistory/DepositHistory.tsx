// src/app/components/deposit/DepositHistory/DepositHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import styles from './DepositHistory.module.css';
import ThemeContext from '@/app/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Transaction {
  id: number;
  status: string;
  direction: 'in' | 'out';
  currency: string;
  amount: number;
  address: string;
  blockchain_hash: string | null;
  data: {
    user_ip: string;
    user_country: string;
    user_ua: string;
    platform: string;
  };
  created_at: string;
}

interface TransactionsResponse {
  status: string;
  transactions: Transaction[];
}

export default function DepositHistory({ showType = 'all' }: { showType?: 'all' | 'in' | 'out' }) {
  const { t, lang } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      
      try {
        const response = await fetch('https://virtserver.swaggerhub.com/woronaweb/ExChange/1.0.0/api/wallet/transactions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data: TransactionsResponse = await response.json();
        
        if (data.status === 'success') {
          // Show all transactions
          setTransactions(data.transactions);
        } else {
          throw new Error('API returned an error');
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Truncate blockchain hash for display
  const truncateHash = (hash: string | null) => {
    if (!hash) return '-';
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };
  
  // Get status class based on status
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusPending;
    }
  };
  
  // Update filtered transactions when all transactions change or when showType changes
  useEffect(() => {
    if (transactions.length > 0) {
      if (showType === 'all') {
        setFilteredTransactions(transactions);
      } else {
        const filtered = transactions.filter(tx => tx.direction === showType);
        setFilteredTransactions(filtered);
      }
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, showType]);
  
  // Get currency logo based on symbol
  const getCurrencyLogo = (symbol: string) => {
    try {
      return `/images/crypto/${symbol.toLowerCase()}.svg`;
    } catch (e) {
      return '/images/crypto/generic.svg';
    }
  };
  
  // Get direction label
  const getDirectionLabel = (direction: 'in' | 'out') => {
    return direction === 'in' ? t('deposit') : t('withdrawal');
  };
  

  
  // Get title based on showType
  const getTitle = () => {
    switch (showType) {
      case 'in':
        return t('depositHistory');
      case 'out':
        return t('withdrawalHistory');
      default:
        return t('transactionHistory');
    }
  };

  return (
    <div className={theme === 'dark' ? styles.containerDark : styles.containerLight}>
      <div className={styles.header}>
        <h2 className={styles.title}>{getTitle()}</h2>
        <Link 
          href="/wallet/history" 
          className={theme === 'dark' ? styles.viewAllLinkDark : styles.viewAllLinkLight}
        >
          {t('more')}
          <svg 
            className={styles.arrowIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 5l7 7-7 7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={theme === 'dark' ? styles.spinnerDark : styles.spinnerLight}></div>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={theme === 'dark' ? styles.emptyTextDark : styles.emptyTextLight}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
          >
            {t('retry')}
          </button>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={theme === 'dark' ? styles.emptyTextDark : styles.emptyTextLight}>
            {t('noDepositsFound')}
          </p>
          <Link 
            href="/deposit"
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
          >
            {t('makeDeposit')}
          </Link>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={theme === 'dark' ? styles.tableHeaderDark : styles.tableHeaderLight}>
                <th className={styles.tableHeaderCell}>{t('asset')}</th>
                <th className={styles.tableHeaderCell}>{t('amount')}</th>
                <th className={styles.tableHeaderCell}>{t('address')}</th>
                <th className={styles.tableHeaderCell}>{t('txid')}</th>
                <th className={styles.tableHeaderCell}>{t('time')}</th>
                <th className={styles.tableHeaderCell}>{t('status')}</th>
                {showType === 'all' && (
                  <th className={styles.tableHeaderCell}>{t('type')}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={theme === 'dark' ? styles.tableRowDark : styles.tableRowLight}
                >
                  <td className={styles.tableCell}>
                    <div className={styles.assetCell}>
                      <div className={styles.assetLogo}>
                        <Image
                          src={getCurrencyLogo(transaction.currency)}
                          alt={transaction.currency}
                          width={24}
                          height={24}
                        />
                      </div>
                      <span>{transaction.currency}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{transaction.amount.toFixed(8)}</td>
                  <td className={styles.tableCell}>{transaction.address.slice(0, 12)}…</td>
                  <td className={styles.tableCell}>
                    {transaction.blockchain_hash ? (
                      <a
                        href={`https://blockchain.com/explorer/transactions/${transaction.blockchain_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <span className={styles.txidText}>{truncateHash(transaction.blockchain_hash)}</span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className={styles.tableCell}>{formatDate(transaction.created_at)}</td>
                  <td className={styles.tableCell}>
                    <span className={getStatusClass(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  {showType === 'all' && (
                    <td className={styles.tableCell}>
                      <span
                        className={
                          transaction.direction === 'in'
                            ? styles.statusCompleted
                            : styles.statusPending
                        }
                      >
                        {getDirectionLabel(transaction.direction)}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}