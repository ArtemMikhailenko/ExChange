'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { Sun, Moon, ChevronDown, Globe, Menu, X } from 'lucide-react';
import i18nInstance from '@/i18n';
import { ThemeContext } from '@/app/context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<string[]>([]);
  
  // Scroll state variables
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Handle scroll events only on the home page
  useEffect(() => {
    // Only apply scroll effects on the home page
    if (!isHomePage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state if we've scrolled down at all
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & not at the top
        setHidden(true);
      } else {
        // Scrolling up or at the top
        setHidden(false);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isHomePage]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
      label: t('futures'), 
      description: t('futuresDesc'), 
      href: '#',
      icon: '/images/header/icon1.svg'
    },
    { 
      label: t('tradingBots'), 
      description: t('tradingBotsDesc'), 
      href: '/robot',
      icon: '/images/header/icon2.svg'
    },
    { 
      label: t('demoTrading'), 
      description: t('demoTradingDesc'), 
      href: '#',
      icon: '/images/header/icon3.svg',
      tag: 'Try UTA Now!'
    },
  ];

  // More dropdown items
  const moreItems = [
    { 
      label: t('rewardsHub'), 
      description: t('rewardsHubDesc'), 
      href: '#',
      icon: '/images/header/icon4.svg' 
    },
    { 
      label: t('activityCenter'), 
      description: t('activityCenterDesc'), 
      href: '#',
      icon: '/images/header/icon5.svg' 
    },
    { 
      label: t('affiliates'), 
      description: t('affiliatesDesc'), 
      href: '#',
      icon: '/images/header/icon6.svg' 
    },
    { 
      label: t('referral'), 
      description: t('referralDesc'), 
      href: '#',
      icon: '/images/header/icon7.svg' 
    },
    { 
      label: t('news'), 
      description: t('newsDesc'), 
      href: '#',
      icon: '/images/header/icon8.svg' 
    },
    { 
      label: t('academy'), 
      description: t('academyDesc'), 
      href: '#',
      icon: '/images/header/icon9.svg' 
    },
  ];

  // Determine header class names based on whether we're on the home page
  const headerClassNames = [
    styles.header,
    isHomePage ? styles.stickyHeader : '',
    isHomePage && scrolled ? styles.headerScrolled : '',
    isHomePage && hidden ? styles.headerHidden : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClassNames}>
        <div className={`${styles.container} ${isHomePage && scrolled ? styles.scrolledContainer : ''}`}>
          <div className={styles.leftSection}>
            <div className={`${styles.logo} ${isHomePage && scrolled ? styles.scrolledLogo : ''}`}>
              <Link href='/'>LOGO</Link>
            </div>
            
            <nav className={styles.desktopNav}>
              <ul className={styles.navList}>
                <li>
                  <NavItem label={t('buyCrypto')} href="#" />
                </li>
                <li>
                  <NavItem label={t('markets')} href="#" />
                </li>
                <li>
                  <NavItem label={t('spot')} href="#" />
                </li>
                
                {/* Futures dropdown */}
                <li className={styles.dropdownContainer}>
                  <button className={styles.dropdownTrigger}>
                    {t('futures')}
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
                  <NavItem label={t('copyTrading')} href="#" />
                </li>
                <li>
                  <NavItem label={t('earn')} href="#" />
                </li>
                
                {/* More dropdown */}
                <li className={styles.dropdownContainer}>
                  <button className={styles.dropdownTrigger}>
                    {t('more')}
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
              {t('login')}
            </Link>
            <Link href="/signup" className={`${styles.authLink} ${styles.signupLink}`}>
              {t('signUp')}
            </Link>
            
            {/* Language selector */}
            <div className={`${styles.languageDropdown} ${isLanguageDropdownOpen ? styles.languageDropdownOpen : ''}`}>
              <button 
                onClick={toggleLanguageDropdown}
                className={styles.iconButton}
                aria-label="Language selector"
              >
                <Globe size={20} />
              </button>
              
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
                <Link 
                  href="#" 
                  className={styles.navItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('buyCrypto')}
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className={styles.navItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('markets')}
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className={styles.navItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('spot')}
                </Link>
              </li>
              
              {/* Mobile Futures dropdown */}
              <li className={styles.mobileDropdownItem}>
                <button 
                  onClick={() => toggleMobileExpanded('futures')}
                  className={styles.mobileDropdownTrigger}
                >
                  {t('futures')}
                  <ChevronDown size={16} />
                </button>
                
                {mobileExpandedItems.includes('futures') && (
                  <div className={styles.mobileDropdownContent}>
                    {futuresItems.map((item) => (
                      <Link 
                        key={item.label} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                        {item.tag && ` (${item.tag})`}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              
              <li>
                <Link 
                  href="#" 
                  className={styles.navItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('copyTrading')}
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className={styles.navItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('earn')}
                </Link>
              </li>
              
              {/* Mobile More dropdown */}
              <li className={styles.mobileDropdownItem}>
                <button 
                  onClick={() => toggleMobileExpanded('more')}
                  className={styles.mobileDropdownTrigger}
                >
                  {t('more')}
                  <ChevronDown size={16} />
                </button>
                
                {mobileExpandedItems.includes('more') && (
                  <div className={styles.mobileDropdownContent}>
                    {moreItems.map((item) => (
                      <Link 
                        key={item.label} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </nav>
          
          <div className={styles.mobileAuthButtons}>
            <Link 
              href="/login" 
              className={`${styles.mobileAuthButton} ${styles.mobileLoginButton}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('login')}
            </Link>
            <Link 
              href="/signup" 
              className={`${styles.mobileAuthButton} ${styles.mobileSignupButton}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from being hidden under the fixed header, only on home page */}
      {isHomePage && <div className={styles.headerSpacer}></div>}
    </>
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