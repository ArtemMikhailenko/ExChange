'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './FAQSection.module.css';

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const { t } = useTranslation('common');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: t('faqProductsQuestion'),
      answer: t('faqProductsAnswer')
    },
    {
      question: t('faqSecurityQuestion'),
      answer: t('faqSecurityAnswer')
    },
    {
      question: t('faqBuyQuestion'),
      answer: t('faqBuyAnswer')
    },
    {
      question: t('faqTradeQuestion'),
      answer: t('faqTradeAnswer')
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>FAQ</h2>
          <Link 
            href="/faq" 
            className={styles.moreLink}
          >
            {t('more')}
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={styles.faqItem}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className={styles.questionButton}
              >
                <span className={styles.questionText}>
                  {item.question}
                </span>
                <span className={styles.iconWrapper}>
                  <PlusIcon 
                    className={openIndex === index ? 
                      `${styles.plusIcon} ${styles.rotated}` : 
                      styles.plusIcon
                    } 
                  />
                </span>
              </button>
              <div 
                className={
                  openIndex === index ? 
                  `${styles.answerContainer} ${styles.open}` : 
                  styles.answerContainer
                }
              >
                <p className={styles.answerText}>
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 5V19M5 12H19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}