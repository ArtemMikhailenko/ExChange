'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import QRCode from 'react-qr-code';
import styles from './DepositDetails.module.css';
import { useTranslation } from '@/hooks/useTranslation';

interface WalletResponse {
  status: string;
  address: string;
  currency: string;
  balance: string;
  msg?: string;
}

interface DepositDetailsProps {
  crypto: any;
  network: any;
}

export default function DepositDetails({ crypto, network }: DepositDetailsProps) {
  const { t, lang } = useTranslation();
  const { theme } = useTheme();
  const [depositAddress, setDepositAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWalletAddress = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make sure we're using the correct API endpoint with the selected cryptocurrency
        const response = await fetch('https://virtserver.swaggerhub.com/woronaweb/ExChange/1.0.0/api/wallet/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currency: crypto.symbol
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching wallet address: ${response.status}`);
        }

        const data: WalletResponse = await response.json();

        if (data.status === 'success') {
          setDepositAddress(data.address);
          setWalletBalance(data.balance);
        } else {
          throw new Error(data.msg || 'Failed to get wallet address');
        }
      } catch (err: any) {
        console.error('Error fetching wallet address:', err);
        setError(err.message || 'Failed to load wallet address');
      } finally {
        setLoading(false);
      }
    };
    
    if (crypto && network) {
      fetchWalletAddress();
    }
  }, [crypto, network]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };
  
  if (!crypto || !network) return null;
  
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={theme === 'dark' ? styles.spinnerDark : styles.spinnerLight}></div>
          <p>{t('fetchingWalletAddress')}</p>
        </div>
      ) : error ? (
        <div className={theme === 'dark' ? styles.errorBoxDark : styles.errorBoxLight}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            {t('retry')}
          </button>
        </div>
      ) : (
        <div>
          <div className={theme === 'dark' ? styles.warningBoxDark : styles.warningBoxLight}>
            <div className={styles.warningIcon}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                stroke="currentColor" 
                className={styles.warningIconSvg}>
                <path d="M12 9v3m0 0v3m0-3h.01M12 21a9 9 0 110-18 9 9 0 010 18z" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.warningContent}>
              <p className={theme === 'dark' ? styles.warningTitleDark : styles.warningTitleLight}>
                {t('importantNotice')}
              </p>
              <p className={theme === 'dark' ? styles.warningTextDark : styles.warningTextLight}>
                {t('sendOnlyDescription')}
              </p>
              <p className={theme === 'dark' ? styles.warningNotesDark : styles.warningNotesLight}>
                {t('minDepositWarning')}
              </p>
            </div>
          </div>
          
          <div className={styles.depositFormContainer}>
            <div className={styles.addressContainer}>
              <div className={styles.walletInfoHeader}>
                <label className={theme === 'dark' ? styles.formLabelDark : styles.formLabelLight}>
                  {t('depositAddress')}
                </label>
                {walletBalance && (
                  <div className={theme === 'dark' ? styles.balanceInfoDark : styles.balanceInfoLight}>
                    <span>{t('currentBalance')}:</span> 
                    <strong>{walletBalance} {crypto.symbol}</strong>
                  </div>
                )}
              </div>
              
              <div className={theme === 'dark' ? styles.addressFieldDark : styles.addressFieldLight}>
                <input
                  type="text"
                  className={theme === 'dark' ? styles.addressInputDark : styles.addressInputLight}
                  value={depositAddress}
                  readOnly
                />
                <button
                  onClick={copyToClipboard}
                  className={styles.copyButton}
                  aria-label="Copy to clipboard"
                >
                  {copiedAddress ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.copyIcon}>
                      <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8a2 2 0 00-2 2zM16 2v4M8 8H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <p className={theme === 'dark' ? styles.networkInfoDark : styles.networkInfoLight}>
                {t('networkType')}: {network.full_name}
              </p>
            </div>
            
            <div className={styles.qrCodeContainer}>
              <label className={theme === 'dark' ? styles.formLabelDark : styles.formLabelLight}>
                {t('qrCode')}
              </label>
              <div className={styles.qrCodeWrapper}>
                <QRCode
                  value={depositAddress}
                  size={150}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  level={"L"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}