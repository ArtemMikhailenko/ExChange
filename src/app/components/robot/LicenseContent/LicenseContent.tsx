// src/components/RoboTrading/LicenseContent/LicenseContent.tsx
'use client';

import React from 'react';
import styles from './LicenseContent.module.css';
import { useTranslation } from 'react-i18next';

type PlanFeature = string;

interface PricingPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  features: PlanFeature[];
  highlighted: boolean;
}

const LicenseContent: React.FC = () => {
  const { t } = useTranslation('common');

  // Pricing plan data
  const plans: PricingPlan[] = [
    {
      id: 'standard',
      title: 'STANDARD KEY',
      description: 'The best solution for novice traders',
      price: '$200',
      duration: '1 month Key',
      features: [
        '5 trading pairs',
        'Up to 1 subscribers',
        'Basic analytics',
        '48-hour support response time'
      ],
      highlighted: false
    },
    {
      id: 'premium',
      title: 'PREMIUM KEY',
      description: 'The best solution for advanced traders',
      price: '$500',
      duration: '3 month Key',
      features: [
        '25 trading pairs',
        'Up to 3 subscribers',
        'Advanced analytics',
        '24-hour support response time'
      ],
      highlighted: true
    },
    {
      id: 'vip',
      title: 'VIP KEY',
      description: 'The best solution for experienced traders',
      price: '$1000',
      duration: '12 month Key',
      features: [
        'Unlimited trading pairs',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time'
      ],
      highlighted: false
    }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('buyLicense', 'Buy License')}</h2>
      
      <div className={styles.plansContainer}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`${styles.planCard} ${plan.highlighted ? styles.highlightedPlan : ''}`}
          >  
            <div className={styles.planHeader}>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planDescription}>{plan.description}</p>
            </div>
            
            <div className={styles.planPricing}>
              <span className={styles.planPrice}>{plan.price}</span>
              <span className={styles.planDuration}> / {plan.duration}</span>
            </div>
            
            <button className={`${styles.buyButton} ${plan.highlighted ? styles.highlightedButton : ''}`}>
              {t('buyPlan', 'Buy plan')}
            </button>
            
            <ul className={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenseContent;