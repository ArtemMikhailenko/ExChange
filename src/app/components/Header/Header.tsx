'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Sun, Moon, ChevronDown, Globe, Menu, X } from 'lucide-react';
import i18nInstance from '@/i18n';
import { ThemeContext } from '@/app/context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<string[]>([]);

  const changeLanguage = (lang: string) => {
    i18nInstance.changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileExpanded = (id: string) => {
    if (mobileExpandedItems.includes(id)) {
      setMobileExpandedItems(mobileExpandedItems.filter(item => item !== id));
    } else {
      setMobileExpandedItems([...mobileExpandedItems, id]);
    }
  };

  // Futures dropdown items
  const futuresItems = [
    { 
      label: t('futures', 'Futures'), 
      description: t('futuresDesc', 'Trade with up to 125x leverage'), 
      href: '#',
      icon: '/images/header/icon1.svg'
    },
    { 
      label: t('tradingBots', 'Robot'), 
      description: t('tradingBotsDesc', 'Automated trading strategies'), 
      href: '/robot',
      icon: '/images/header/icon2.svg'
    },
    { 
      label: t('demoTrading', 'Demo Trading'), 
      description: t('demoTradingDesc', 'Practice without risk'), 
      href: '#',
      icon: '/images/header/icon3.svg',
      tag: 'Try UTA Now!'
    },
  ];

  // More dropdown items
  const moreItems = [
    { 
      label: t('rewardsHub', 'Rewards Hub'), 
      description: t('rewardsHubDesc', 'Earn rewards for trading'), 
      href: '#',
      icon: '/images/header/icon4.svg' 
    },
    { 
      label: t('activityCenter', 'Activity Center'), 
      description: t('activityCenterDesc', 'Track your account activity'), 
      href: '#',
      icon: '/images/header/icon5.svg' 
    },
    { 
      label: t('affiliates', 'Affiliates'), 
      description: t('affiliatesDesc', 'Earn commission from referrals'), 
      href: '#',
      icon: '/images/header/icon6.svg' 
    },
    { 
      label: t('referral', 'Referral'), 
      description: t('referralDesc', 'Invite friends and earn rewards'), 
      href: '#',
      icon: '/images/header/icon7.svg' 
    },
    { 
      label: t('news', 'News'), 
      description: t('newsDesc', 'Latest industry updates'), 
      href: '#',
      icon: '/images/header/icon8.svg' 
    },
    { 
      label: t('academy', 'Academy'), 
      description: t('academyDesc', 'Learn about crypto trading'), 
      href: '#',
      icon: '/images/header/icon9.svg' 
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.logo}>LOGO</div>
          
          <nav className={styles.desktopNav}>
            <ul className={styles.navList}>
              <li>
                <NavItem label={t('buyCrypto', 'Buy Crypto')} href="#" />
              </li>
              <li>
                <NavItem label={t('markets', 'Markets')} href="#" />
              </li>
              <li>
                <NavItem label={t('spot', 'Spot')} href="#" />
              </li>
              
              {/* Futures dropdown */}
              <li className={styles.dropdownContainer}>
                <button className={styles.dropdownTrigger}>
                  {t('futures', 'Futures')}
                  <ChevronDown className={styles.chevronIcon} />
                </button>
                
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownPadding}></div>
                  {futuresItems.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.dropdownItem}>
                      <div className={styles.dropdownItemIcon}>
                        <Image
                          src={item.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div className={styles.dropdownItemContent}>
                        <div className={styles.dropdownItemTitle}>
                          {item.label}
                          {item.tag && (
                            <span className={styles.dropdownTag}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div className={styles.dropdownItemDescription}>{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </li>
              
              <li>
                <NavItem label={t('copyTrading', 'Copy Trading')} href="#" />
              </li>
              <li>
                <NavItem label={t('earn', 'Earn')} href="#" />
              </li>
              
              {/* More dropdown */}
              <li className={styles.dropdownContainer}>
                <button className={styles.dropdownTrigger}>
                  {t('more', 'More')}
                  <ChevronDown className={styles.chevronIcon} />
                </button>
                
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownPadding}></div>
                  {moreItems.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.dropdownItem}>
                      <div className={styles.dropdownItemIcon}>
                        <Image
                          src={item.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div className={styles.dropdownItemContent}>
                        <div className={styles.dropdownItemTitle}>{item.label}</div>
                        <div className={styles.dropdownItemDescription}>{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Right section: Login / Sign Up / Theme / Language */}
        <div className={styles.rightSection}>
          <Link href="/login" className={`${styles.authLink} ${styles.loginLink}`}>
            Log in
          </Link>
          <Link href="/signup" className={`${styles.authLink} ${styles.signupLink}`}>
            Sign up
          </Link>
          
          {/* Language selector */}
          <div className={styles.languageDropdown}>
            <button 
              onClick={toggleLanguageDropdown}
              className={styles.iconButton}
              aria-label="Language selector"
            >
              <Globe size={20} />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className={styles.languageMenu}>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`${styles.languageOption} ${i18nInstance.language === 'en' ? styles.languageOptionActive : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`${styles.languageOption} ${i18nInstance.language === 'ru' ? styles.languageOptionActive : ''}`}
                >
                  Русский
                </button>
              </div>
            )}
          </div>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme} 
            className={styles.iconButton}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Mobile menu toggle */}
          <button 
            onClick={toggleMobileMenu}
            className={styles.burgerButton}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOverlayOpen : ''}`}
        onClick={toggleMobileMenu}
      ></div>
      
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logo}>LOGO</div>
          <button
            onClick={toggleMobileMenu}
            className={styles.iconButton}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav>
          <ul className={styles.mobileNavList}>
            <li>
              <Link href="#" className={styles.navItem}>{t('buyCrypto', 'Buy Crypto')}</Link>
            </li>
            <li>
              <Link href="#" className={styles.navItem}>{t('markets', 'Markets')}</Link>
            </li>
            <li>
              <Link href="#" className={styles.navItem}>{t('spot', 'Spot')}</Link>
            </li>
            
            {/* Mobile Futures dropdown */}
            <li className={styles.mobileDropdownItem}>
              <button 
                onClick={() => toggleMobileExpanded('futures')}
                className={styles.mobileDropdownTrigger}
              >
                {t('futures', 'Futures')}
                <ChevronDown size={16} />
              </button>
              
              {mobileExpandedItems.includes('futures') && (
                <div className={styles.mobileDropdownContent}>
                  {futuresItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                      {item.label}
                      {item.tag && ` (${item.tag})`}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            
            <li>
              <Link href="#" className={styles.navItem}>{t('copyTrading', 'Copy Trading')}</Link>
            </li>
            <li>
              <Link href="#" className={styles.navItem}>{t('earn', 'Earn')}</Link>
            </li>
            
            {/* Mobile More dropdown */}
            <li className={styles.mobileDropdownItem}>
              <button 
                onClick={() => toggleMobileExpanded('more')}
                className={styles.mobileDropdownTrigger}
              >
                {t('more', 'More')}
                <ChevronDown size={16} />
              </button>
              
              {mobileExpandedItems.includes('more') && (
                <div className={styles.mobileDropdownContent}>
                  {moreItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
        
        <div className={styles.mobileAuthButtons}>
          <Link href="/login" className={`${styles.mobileAuthButton} ${styles.mobileLoginButton}`}>
            Log in
          </Link>
          <Link href="/signup" className={`${styles.mobileAuthButton} ${styles.mobileSignupButton}`}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavItem({ label, href, isActive = false }: { label: string; href: string; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
    >
      {label}
    </Link>
  );
}