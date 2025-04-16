'use client';

import React, { useState } from 'react';
import styles from './LicenseContent.module.css';
import { robotService, KeyType } from '@/services/robotService';
import { useTranslation } from '@/hooks/useTranslation';

// Types
type PlanFeature = string;

interface PricingPlan {
  id: string;
  titleKey: string;
  descriptionKey: string;
  price: string;
  duration: string;
  features: PlanFeature[];
  highlighted: boolean;
  popular?: boolean;
  keyType: KeyType; // API expects this enum
}

const LicenseContent: React.FC = () => {
  const { t, lang } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [purchasedKey, setPurchasedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Pricing plan data
  const plans: PricingPlan[] = [
    {
      id: 'standard',
      titleKey: 'license.standardTitle',
      descriptionKey: 'license.standardDesc',
      price: '$200',
      duration: '1 month Key',
      features: [
        '5 trading pairs',
        'Up to 1 subscribers',
        'Basic analytics',
        '48-hour support response time'
      ],
      highlighted: false,
      keyType: 'standart'
    },
    {
      id: 'premium',
      titleKey: 'license.premiumTitle',
      descriptionKey: 'license.premiumDesc',
      price: '$500',
      duration: '3 month Key',
      features: [
        '25 trading pairs',
        'Up to 3 subscribers',
        'Advanced analytics',
        '24-hour support response time'
      ],
      highlighted: true,
      popular: true,
      keyType: 'premium'
    },
    {
      id: 'vip',
      titleKey: 'license.vipTitle',
      descriptionKey: 'license.vipDesc',
      price: '$1000',
      duration: '12 month Key',
      features: [
        'Unlimited trading pairs',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time'
      ],
      highlighted: false,
      keyType: 'vip'
    }
  ];
  
  // Function to handle buying a key
  const handleBuyKey = async (keyType: KeyType, planId: string) => {
    // Reset states
    setError(null);
    setPurchasedKey(null);
    setCopiedKey(false);
    setLoading(planId);
    
    try {
      const response = await robotService.buyAndActivateKey(keyType);
      
      if (response.status === 'success' && response.key) {
        setPurchasedKey(response.key);
      } else {
        setError(response.msg || t('license.unknownError'));
      }
    } catch (err) {
      console.error('Error purchasing key:', err);
      setError(t('license.networkError'));
    } finally {
      setLoading(null);
    }
  };

  // Function to copy key to clipboard
  const copyKeyToClipboard = () => {
    if (purchasedKey) {
      navigator.clipboard.writeText(purchasedKey)
        .then(() => {
          setCopiedKey(true);
          // Reset copy confirmation after 3 seconds
          setTimeout(() => setCopiedKey(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          setError(t('license.copyError'));
        });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('license.buyLicense')}</h2>
      
      {/* Success message with copy option */}
      {purchasedKey && (
        <div style={{
          marginBottom: '40px',
          padding: '15px',
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          color: '#4CAF50',
          textAlign: 'center'
        }}>
          <div>{t('license.keyPurchaseSuccess')}:</div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px 0',
            gap: '10px'
          }}>
            <code style={{ 
              background: 'rgba(0,0,0,0.1)', 
              padding: '8px 12px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              maxWidth: '100%'
            }}>
              {purchasedKey}
            </code>
            <button 
              onClick={copyKeyToClipboard} 
              style={{
                border: 'none',
                background: copiedKey ? 'rgba(76, 175, 80, 0.7)' : 'rgba(76, 175, 80, 0.3)',
                color: copiedKey ? 'white' : '#2E7D32',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              {copiedKey ? t('license.copied') : t('license.copyKey')}
            </button>
          </div>
          <div style={{ fontSize: '0.85em', marginTop: '5px' }}>
            {t('license.saveKeyWarning')}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div style={{
          marginBottom: '40px',
          padding: '15px',
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          color: '#F44336',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <div className={styles.plansContainer}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`${styles.planCard} ${plan.highlighted ? styles.highlightedPlan : ''}`}
          >
            {plan.popular && (
              <div className={styles.popularBadge}>
                {t('license.popular')}
              </div>
            )}
            
            <div className={styles.planHeader}>
              <h3 className={styles.planTitle}>{t(plan.titleKey)}</h3>
              <p className={styles.planDescription}>{t(plan.descriptionKey)}</p>
            </div>
            
            <div className={styles.planPricing}>
              <span className={styles.planPrice}>{plan.price}</span>
              <span className={styles.planDuration}> / {plan.duration}</span>
            </div>
            
            <button 
              onClick={() => handleBuyKey(plan.keyType, plan.id)}
              disabled={loading === plan.id}
              className={`${styles.buyButton} ${plan.highlighted ? styles.highlightedButton : ''}`}
              style={loading === plan.id ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {loading === plan.id ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="animate-spin" style={{ marginRight: '8px', width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('license.processing')}
                </span>
              ) : (
                t('license.buyPlan')
              )}
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
