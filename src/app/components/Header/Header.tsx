'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import i18nInstance from '@/i18n';
import { ThemeContext } from '@/app/context/ThemeContext';

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18nInstance.changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
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
      href: '#',
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

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-white">LOGO</div>
          <nav className="hidden items-center space-x-6 md:flex">
            <NavItem label={t('buyCrypto')} href="#" isActive={false} />
            <NavItem label={t('markets')} href="#" isActive={false} />
            <NavItem label={t('spot')} href="#" isActive={false} />
            
            {/* Futures dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center text-sm font-medium text-white group-hover:text-yellow-500"
              >
                {t('futures')}
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="invisible absolute left-0 top-full z-10 mt-2 w-96 text-black rounded-md bg-white border border-black py-2 shadow-xl opacity-0 transform scale-95 transition-all duration-200 origin-top-left group-hover:visible group-hover:opacity-100 group-hover:scale-100">
                <div className="invisible-divider h-4"></div>
                {futuresItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block px-2 py-2 hover:bg-gray-100 flex items-start">
                    <div className="w-12 h-12 mr-4 relative">
                      <Image
                        src={item.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black hover:text-yellow-500 flex items-center">
                        {item.label}
                        {item.tag && (
                          <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <NavItem label={t('copyTrading')} href="#" isActive={false} />
            <NavItem label={t('earn')} href="#" isActive={false} />
            
            {/* More dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center text-sm font-medium text-white group-hover:text-yellow-500"
              >
                {t('more')}
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="invisible absolute left-0 top-full z-10 mt-2 w-96 text-black rounded-md bg-white border border-black py-2 shadow-xl opacity-0 transform scale-95 transition-all duration-200 origin-top-left group-hover:visible group-hover:opacity-100 group-hover:scale-100">
                <div className="invisible-divider h-4"></div>
                {moreItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block px-2 py-2 hover:text-yellow-500 hover:bg-gray-100 transition-colors duration-200 flex items-start">
                    <div className="w-12 h-12 mr-4 relative">
                      <Image
                        src={item.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black hover:text-yellow-500">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
        
        {/* Right section: Login / Sign Up / Theme / Language */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="hidden text-sm font-medium text-white hover:text-gray-200 md:block"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="hidden rounded bg-yellow-500 px-6 py-2 text-sm font-medium text-black hover:bg-yellow-600 md:block"
          >
            Sign up
          </Link>
          
          {/* Language selector */}
          <div className="relative">
            <button 
              onClick={toggleLanguageDropdown}
              className="p-2 text-white hover:text-gray-200"
              aria-label="Language selector"
            >
              <Globe size={20} />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    i18nInstance.language === 'en' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    i18nInstance.language === 'ru' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Русский
                </button>
              </div>
            )}
          </div>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 text-white hover:text-gray-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ label, href, isActive = false }: { label: string; href: string; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`text-sm font-medium ${
        isActive 
          ? 'text-yellow-500' 
          : 'text-white hover:text-yellow-500'
      }`}
    >
      {label}
    </Link>
  );
}