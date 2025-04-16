'use client';

import React, { useState } from 'react';
import styles from './RoboTrading.module.css';
import ConfigurationPanel from '../ConfigurationPanel/ConfigurationPanel';
import UserDashboard from '../UserDashboard/UserDashboard';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import RobotContent from '../RobotContent/RobotContent';
import LicenseContent from '../LicenseContent/LicenseContent';
import { useTranslation } from '@/hooks/useTranslation';

const RoboTrading = () => {
  const [activeTab, setActiveTab] = useState('configuration');

  const renderContent = () => {
    switch (activeTab) {
      case 'robot':
        return <RobotContent />;
      case 'license':
        return <LicenseContent />;
      case 'configuration':
        return <ConfigurationPanel />;
      default:
        return <RobotContent />;
    }
  };

  const tabIllustrations: Record<string, string> = {
    configuration: '/images/robot/config-img.svg',
    robot: '/images/robot/config-img2.svg',
    license: '/images/robot/config-img.svg',
  };
  
  const illustrationSrc = tabIllustrations[activeTab] || tabIllustrations.configuration;
  const { t, lang } = useTranslation();

  return (
    <div className={styles.container}>
      <section className={styles.topSection}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>{t('robo.title')}</h1>
          <p className={styles.subtitle}>{t('robo.subtitle')}</p>
          <UserDashboard />
        </div>

        <div className={styles.rightContent}>
          <div className={styles.illustrationTitle}>
            <p>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 14.6711H0.328857C0.328857 13.7022 0.573302 12.8015 1.06219 11.9689C1.53182 11.1674 2.16738 10.5319 2.96886 10.0622C3.80145 9.57333 4.69997 9.32889 5.66441 9.32889C6.62738 9.32889 7.52589 9.57333 8.35997 10.0622C9.16145 10.5319 9.79701 11.1674 10.2666 11.9689C10.7555 12.8015 11 13.7022 11 14.6711ZM5.67108 8.67111C4.94219 8.67111 4.2733 8.49185 3.66441 8.13333C3.05552 7.77333 2.57108 7.28593 2.21108 6.67111C1.85108 6.05778 1.67108 5.38889 1.67108 4.66445C1.67108 3.94 1.85108 3.27333 2.21108 2.66445C2.57108 2.05556 3.05552 1.57111 3.66441 1.21111C4.2733 0.851112 4.93997 0.671112 5.66441 0.671112C6.38886 0.671112 7.05775 0.851112 7.67108 1.21111C8.28589 1.57111 8.7733 2.05556 9.1333 2.66445C9.49182 3.27333 9.67108 3.94 9.67108 4.66445C9.67108 5.38889 9.49182 6.05778 9.1333 6.67111C8.7733 7.28593 8.28589 7.77333 7.67108 8.13333C7.05775 8.49185 6.39108 8.67111 5.67108 8.67111ZM10.5777 10.1556C11.2652 10.3333 11.8852 10.6407 12.4377 11.0778C12.9903 11.5148 13.4303 12.0437 13.7577 12.6644C14.0866 13.2837 14.277 13.9526 14.3289 14.6711H12.3289C12.3289 13.8178 12.1726 12.9948 11.86 12.2022C11.5577 11.4422 11.1303 10.76 10.5777 10.1556ZM9.2333 8.64C9.79626 8.13037 10.2318 7.52889 10.54 6.83556C10.8466 6.1437 11 5.42222 11 4.67111C11 3.74519 10.7763 2.87556 10.3289 2.06222C10.8385 2.16593 11.2963 2.37704 11.7022 2.69556C12.1096 3.01259 12.4274 3.40074 12.6555 3.86C12.8852 4.31778 13 4.80741 13 5.32889C13 5.80741 12.9007 6.26519 12.7022 6.70222C12.5052 7.14074 12.2266 7.51852 11.8666 7.83556C11.5081 8.15407 11.097 8.3837 10.6333 8.52445C10.1696 8.6637 9.70293 8.70222 9.2333 8.64Z" fill="#FCFDFF" />
              </svg>
              {t('robo.becomeTrader')}
            </p>
            <p>
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4062 12H8.07733V13.3289H6.73511V12H1.40622C1.21807 12 1.05955 11.9348 0.930663 11.8044C0.800293 11.6741 0.735107 11.5156 0.735107 11.3289V0.671111C0.735107 0.484445 0.800293 0.325926 0.930663 0.195556C1.05955 0.0651852 1.21807 0 1.40622 0H5.40622C5.80177 0 6.1714 0.0807408 6.51511 0.242222C6.85881 0.403704 7.15585 0.625185 7.40622 0.906667C7.65659 0.614815 7.95585 0.39037 8.304 0.233333C8.65363 0.0777778 9.02103 0 9.40622 0H13.4062C13.5944 0 13.7529 0.0651852 13.8818 0.195556C14.0121 0.325926 14.0773 0.484445 14.0773 0.671111V11.3289C14.0773 11.5156 14.0121 11.6741 13.8818 11.8044C13.7529 11.9348 13.5944 12 13.4062 12ZM8.07733 10.6711H12.7351V1.32889H9.40622C9.04177 1.32889 8.72918 1.45852 8.46844 1.71778C8.2077 1.97852 8.07733 2.2963 8.07733 2.67111V10.6711ZM2.07733 10.6711H6.73511V2.67111C6.73511 2.2963 6.60474 1.97852 6.344 1.71778C6.08326 1.45852 5.77066 1.32889 5.40622 1.32889H2.07733V10.6711Z" fill="#FCFDFF" />
              </svg>
              {t('robo.beginnersGuide')}
            </p>
          </div>
          <div className={styles.illustrationContainer}>
            <img 
              src={illustrationSrc}
              alt="Illustration" 
              className={styles.chartIllustration} 
            />
          </div>
        </div>
      </section>

      <div className={styles.tabsContainer}>
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      <section className={styles.contentSection}>
        {renderContent()}
      </section>
    </div>
  );
};

export default RoboTrading;