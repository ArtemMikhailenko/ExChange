'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import Image from 'next/image';
import styles from './CryptoSelector.module.css';
import { useTranslation } from 'react-i18next';

// Define crypto currency type
interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  balance?: string;
}

interface CryptoSelectorProps {
  onSelect: (crypto: Cryptocurrency) => void;
}

interface BalancesResponse {
  status: string;
  balances: {
    [key: string]: string;
  };
}

export default function CryptoSelector({ onSelect }: CryptoSelectorProps) {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch balances from API
  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://apiexchange.ymca.one/api/wallet/getBalances', {
          method: 'POST',
          credentials: 'include', // Include credentials for cookies
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch balances');
        }

        const data: BalancesResponse = await response.json();

        if (data.status === 'success') {
          // Create cryptocurrency list directly from the balances object
          const cryptoList = Object.entries(data.balances).map(([symbol, balance]) => {
            return {
              id: symbol.toLowerCase(),
              symbol: symbol,
              name: symbol, // Use symbol as name
              balance
            };
          });
          
          setCryptocurrencies(cryptoList);
        } else {
          throw new Error('API returned error status');
        }
      } catch (err: any) {
        console.error('Error fetching balances:', err);
        setError(err.message || 'Failed to load wallet balances');
        setCryptocurrencies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  // Filter cryptocurrencies based on search query
  const filteredCryptos = cryptocurrencies.filter(crypto => 
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format balance to show a shortened version if it's too long
  const formatBalance = (balance: string | undefined) => {
    if (!balance) return '0.00';
    
    // Parse the value to a number
    const numValue = parseFloat(balance);
    
    // If the value is zero, return 0
    if (numValue === 0) return '0.00';
    
    // If the value is very small (less than 0.01), show in scientific notation
    if (numValue < 0.01 && numValue > 0) {
      return numValue.toExponential(2);
    }
    
    // Otherwise, limit to 8 decimal places maximum or fewer if possible
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  // Get image URL from CDN
  const getCryptoImageUrl = (symbol: string) => {
    return `https://cdnexchange.ymca.one/${symbol}.png`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchIconWrapper}>
          <svg className={theme === 'dark' ? styles.searchIconDark : styles.searchIconLight}
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          className={theme === 'dark' ? styles.searchInputDark : styles.searchInputLight}
          placeholder={t('searchCrypto')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={theme === 'dark' ? styles.loaderDark : styles.loaderLight}></div>
          <p>{t('loadingBalances')}</p>
        </div>
      )}
      
      {error && !loading && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!loading && filteredCryptos.length === 0 && !error && (
        <div className={styles.noResults}>
          <p>{t('noCryptoFound')}</p>
        </div>
      )}

      <div className={styles.cryptoGrid}>
        {filteredCryptos.map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => onSelect(crypto)}
            className={theme === 'dark' ? styles.cryptoCardDark : styles.cryptoCardLight}
          >
            <div className={styles.cryptoLogo}>
              <Image
                src={getCryptoImageUrl(crypto.symbol)}
                alt={crypto.name}
                width={40}
                height={40}
                className={styles.logoImage}
                onError={(e) => {
                  // Fallback if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/crypto/placeholder.svg';
                }}
              />
            </div>
            <div className={styles.cryptoInfo}>
              <span className={styles.cryptoSymbol}>{crypto.symbol}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}