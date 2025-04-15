'use client';

import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';
import styles from './DepositHeader.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function DepositHeader() {
  const { t, lang } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <div className={styles.container}>

      <div className={styles.depositHead}>
        <nav className={styles.breadcrumb}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link
                href="/overview"
                className={theme === 'dark' ? styles.breadcrumbLinkDark : styles.breadcrumbLinkLight}
              >
                {t('overview')}
              </Link>
            </li>
            <li className={styles.breadcrumbItem}>
              <div className={styles.breadcrumbDivider}>
                <svg
                  className={theme === 'dark' ? styles.breadcrumbIconDark : styles.breadcrumbIconLight}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className={theme === 'dark' ? styles.breadcrumbActiveDark : styles.breadcrumbActiveLight}>
                  {t('deposit')}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className={styles.titleBar}>
          <h1 className={styles.title}>{t('deposit')}</h1>
        </div>
      </div>
    </div>
  );
}