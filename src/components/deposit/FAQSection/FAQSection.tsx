// src/app/deposit/components/FAQSection/FAQSection.tsx
'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import Link from 'next/link';
import styles from './FAQSection.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// FAQ item type
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { t, lang } = useTranslation();
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Sample FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 'deposit-account',
      question: t('howDoIDepositCrypto'),
      answer: t('howDoIDepositCryptoAnswer')
    },
    {
      id: 'deposit-address',
      question: t('whereCanIFindDepositAddress'),
      answer: t('whereCanIFindDepositAddressAnswer')
    },
    {
      id: 'not-received',
      question: t('whyHaveINotReceivedDeposit'),
      answer: t('whyHaveINotReceivedDepositAnswer')
    }
  ];
  
  return (
    <div className={theme === 'dark' ? styles.containerDark : styles.containerLight}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('faq')}</h2>
        <Link 
          href="/faq" 
          className={theme === 'dark' ? styles.moreButtonDark : styles.moreButtonLight}
        >
          {t('more')}
          <svg 
            className={styles.moreIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M9 5l7 7-7 7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
      
      <div className={styles.faqList}>
        {faqItems.map((item) => (
          
          <div key={item.id} className={styles.faqItem}>
            
            <button
              className={`${styles.questionButton} ${expandedId === item.id ? styles.expanded : ''}`}
              onClick={() => toggleFAQ(item.id)}
            >
              <div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 12.1421H8.00445V13.471H6.66223V12.1421H1.33334C1.14519 12.1421 0.986676 12.0769 0.857787 11.9465C0.727417 11.8162 0.662231 11.6576 0.662231 11.471V0.813201C0.662231 0.626534 0.727417 0.468016 0.857787 0.337645C0.986676 0.207275 1.14519 0.14209 1.33334 0.14209H5.33334C5.7289 0.14209 6.09853 0.222831 6.44223 0.384312C6.78594 0.545794 7.08297 0.767275 7.33334 1.04876C7.58371 0.756905 7.88297 0.53246 8.23112 0.375423C8.58075 0.219868 8.94816 0.14209 9.33334 0.14209H13.3333C13.5215 0.14209 13.68 0.207275 13.8089 0.337645C13.9393 0.468016 14.0045 0.626534 14.0045 0.813201V11.471C14.0045 11.6576 13.9393 11.8162 13.8089 11.9465C13.68 12.0769 13.5215 12.1421 13.3333 12.1421ZM8.00445 10.8132H12.6622V1.47098H9.33334C8.9689 1.47098 8.65631 1.60061 8.39556 1.85987C8.13482 2.12061 8.00445 2.43839 8.00445 2.8132V10.8132ZM2.00445 10.8132H6.66223V2.8132C6.66223 2.43839 6.53186 2.12061 6.27112 1.85987C6.01038 1.60061 5.69779 1.47098 5.33334 1.47098H2.00445V10.8132Z" fill="#FCFDFF" />
              </svg>
              </div>
              
              <span className={styles.questionText}>{item.question}</span>
              {/* <span className={styles.toggleIcon}>
                {expandedId === item.id ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span> */}
            </button>
            <div className={`${styles.answerContainer} ${expandedId === item.id ? styles.answerExpanded : ''}`}>
              <div className={theme === 'dark' ? styles.answerDark : styles.answerLight}>
                
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}