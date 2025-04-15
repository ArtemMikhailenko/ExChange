'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin
} from 'lucide-react';
import styles from './Footer.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t, lang } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Simple Mobile Footer (visible only on mobile) */}
        <div className={styles.simpleMobileFooter}>
          <div className={styles.mobileLogo}>LOGO</div>
          <div className={styles.mobileCopyright}>
            © 2023-2025 ExChange.COM
          </div>
        </div>
        
        {/* Desktop Footer (hidden on small mobile screens) */}
        <div className={styles.flexContainer}>
          {/* Logo column */}
          <div className={styles.logoColumn}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoWrapper}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 1C30.493 1 39 9.507 39 20C39 30.493 30.493 39 20 39" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className={styles.logoText}>Logoipsum</span>
              </div>
            </Link>
          </div>

          {/* Center navigation columns */}
          <div className={styles.navGridContainer}>
            {/* COMMUNITIES */}
            <div>
              <h3 className={styles.sectionTitle}>
                {t('communities')}
              </h3>
              <ul className={styles.navList}>
                <li>
                  <Link href="/for-companies" className={styles.navLink}>
                    {t('forCompanies')}
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className={styles.navLink}>
                    {t('developers')}
                  </Link>
                </li>
                <li>
                  <Link href="/advertising" className={styles.navLink}>
                    {t('advertising')}
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className={styles.navLink}>
                    {t('investors')}
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className={styles.navLink}>
                    {t('vendors')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className={styles.sectionTitle}>
                {t('company')}
              </h3>
              <ul className={styles.navList}>
                <li>
                  <Link href="/about" className={styles.navLink}>
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className={styles.navLink}>
                    {t('jobs')}
                  </Link>
                </li>
                <li>
                  <Link href="/for-the-record" className={styles.navLink}>
                    {t('forTheRecord')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* USEFUL LINKS */}
            <div>
              <h3 className={styles.sectionTitle}>
                {t('usefulLinks')}
              </h3>
              <ul className={styles.navList}>
                <li>
                  <Link href="/support" className={styles.navLink}>
                    {t('support')}
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app" className={styles.navLink}>
                    {t('freeMobileApp')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons aligned to the right */}
          <div className={styles.socialContainer}>
            <div className={styles.socialIconsWrapper}>
              <Link
                href="https://twitter.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="https://facebook.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://instagram.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://linkedin.com/company/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className={styles.divider}></div>

        {/* Bottom footer with legal links */}
        <div className={styles.footerBottom}>
          <div className={styles.legalLinks}>
            <Link href="/legal" className={styles.legalLink}>
              {t('legal')}
            </Link>
            <Link href="/privacy-center" className={styles.legalLink}>
              {t('privacyCenter')}
            </Link>
            <Link href="/privacy-policy" className={styles.legalLink}>
              {t('privacyPolicy')}
            </Link>
            <Link href="/cookies" className={styles.legalLink}>
              {t('cookies')}
            </Link>
            <Link href="/about-ads" className={styles.legalLink}>
              {t('aboutAds')}
            </Link>
            <Link href="/accessibility" className={styles.legalLink}>
              {t('accessibility')}
            </Link>
          </div>
          <div className={styles.copyright}>
            © 2023-{currentYear} ExChange.COM
          </div>
        </div>
      </div>
    </footer>
  );
}