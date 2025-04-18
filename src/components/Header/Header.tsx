'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Sun, Moon, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';

export default function Header() {
  const { t, lang } = useTranslation();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, refreshSession } = useAuth();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Add session refresh effect on mount
  useEffect(() => {
    // Check if we have a token but no user data
    if (!user && typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
      console.log('Header detected token but no user, refreshing session...');
      refreshSession();
    }
  }, [refreshSession, user]);
  
  // Debug logging for authentication state
  useEffect(() => {
    console.log('Auth state in Header:', { isAuthenticated, user });
  }, [isAuthenticated, user]);
  
  // Scroll state variables
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Dropdown hover state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Refs for dropdown containers
  const futuresDropdownRef = useRef<HTMLLIElement>(null);
  const moreDropdownRef = useRef<HTMLLIElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Dropdown state for user menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Timers for dropdown delay
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close language dropdown if click is outside
      if (isLanguageDropdownOpen && 
          !(event.target as Element).closest('[data-dropdown="language"]')) {
        setIsLanguageDropdownOpen(false);
      }
      
      // Close user menu if click is outside
      if (isUserMenuOpen && 
          !(event.target as Element).closest('[data-dropdown="user"]')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isUserMenuOpen]);

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

  // Handle dropdown mouse enter with delay
  const handleDropdownMouseEnter = (dropdownId: string) => {
    // Clear any existing timer
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    
    setActiveDropdown(dropdownId);
  };

  // Handle dropdown mouse leave with delay
  const handleDropdownMouseLeave = () => {
    // Clear any existing timer
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    
    // Set timer to close dropdown after delay
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
  };

  const changeLanguage = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.push(`${pathname}?${params.toString()}`);
    setIsLanguageDropdownOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/login');
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
      href: '/robo-trading',
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

  // Force authentication for debugging if needed
  // Comment this out when not needed
  /*
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const hasToken = !!localStorage.getItem('auth_token');
      if (!hasToken) {
        console.log('Debug: Setting a dummy token');
        localStorage.setItem('auth_token', 'debug-token');
        refreshSession();
      }
    }
  }, [isAuthenticated, refreshSession]);
  */

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
                
                {/* Futures dropdown with improved hover handling */}
                <li 
                  ref={futuresDropdownRef}
                  className={`${styles.dropdownContainer} ${activeDropdown === 'futures' ? styles.dropdownActive : ''}`}
                  onMouseEnter={() => handleDropdownMouseEnter('futures')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
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
                            className={styles.objectContain}
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
                
                {/* More dropdown with improved hover handling */}
                <li 
                  ref={moreDropdownRef}
                  className={`${styles.dropdownContainer} ${activeDropdown === 'more' ? styles.dropdownActive : ''}`}
                  onMouseEnter={() => handleDropdownMouseEnter('more')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
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
                            className={styles.objectContain}
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
            {isAuthenticated ? (
              <div className={styles.userArea} ref={userMenuRef} data-dropdown="user">
                <button 
                  onClick={toggleUserMenu} 
                  className={styles.userButton}
                >
                  <div className={styles.userAvatar}>
                    <Image
                      src="/images/avatar-placeholder.png"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className={styles.objectCover}
                    />
                  </div>
                  <span className={styles.userName}>
                    {user?.email || 'User'}
                  </span>
                  <ChevronDown className={styles.chevronIcon} />
                </button>
                
                {isUserMenuOpen && (
                  <div className={styles.userDropdown}>
                    <Link href="/profile" className={styles.userDropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      {t('profile')}
                    </Link>
                    <Link href="/settings" className={styles.userDropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      {t('settings')}
                    </Link>
                    <button onClick={handleLogout} className={styles.userDropdownItem}>
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={`${styles.authLink} ${styles.loginLink}`}>
                  {t('login')}
                </Link>
                <Link href="/signup" className={`${styles.authLink} ${styles.signupLink}`}>
                  {t('signUp')}
                </Link>
              </>
            )}
            
            {/* Language selector */}
            <div 
              className={`${styles.languageDropdown} ${isLanguageDropdownOpen ? styles.languageDropdownOpen : ''}`} 
              data-dropdown="language"
            >
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
                  className={`${styles.languageOption} ${lang === 'en' ? styles.languageOptionActive : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`${styles.languageOption} ${lang === 'ru' ? styles.languageOptionActive : ''}`}
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
                        className={styles.mobileNavLink}
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
                        className={styles.mobileNavLink}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </nav>
          
          {isAuthenticated ? (
            <div className={styles.mobileUserArea}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.userAvatar}>
                  <Image
                    src="/images/avatar-placeholder.png"
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className={styles.objectCover}
                  />
                </div>
                <span className={styles.userName}>
                  {user?.email || 'User'}
                </span>
              </div>
              
              <div className={styles.mobileUserLinks}>
                <Link 
                  href="/profile" 
                  className={styles.mobileUserLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('profile')}
                </Link>
                <Link 
                  href="/settings" 
                  className={styles.mobileUserLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('settings')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className={styles.mobileUserLink}
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          ) : (
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
          )}
          
          {/* Mobile language switcher */}
          <div className={styles.mobileLangSwitcher}>
            <button 
              onClick={() => changeLanguage('en')} 
              className={`${styles.mobileLangButton} ${lang === 'en' ? styles.mobileLangButtonActive : ''}`}
            >
              English
            </button>
            <button 
              onClick={() => changeLanguage('ru')} 
              className={`${styles.mobileLangButton} ${lang === 'ru' ? styles.mobileLangButtonActive : ''}`}
            >
              Русский
            </button>
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