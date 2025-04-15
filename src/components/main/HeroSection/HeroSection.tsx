'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import styles from './HeroSection.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
  const { t, lang } = useTranslation();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.textColumn}>
          <h1 className={styles.heroTitle}>{t('heroTitle')}</h1>
          <div className={styles.buttonGroup}>
            <Link
              href="/login"
              className={styles.loginButton}
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className={styles.signupButton}
            >
              {t('signUp')}
            </Link>
          </div>
        </div>

        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/laptop-chart.png"
              alt="Laptop with charts"
              width={500}
              height={400}
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
