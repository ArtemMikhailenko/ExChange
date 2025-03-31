'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
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

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-white">LOGO</div>
          <nav className="hidden items-center space-x-6 md:flex">
            <NavItem label={t('buyCrypto')} href="#" isActive={false} />
            <NavItem label={t('markets')} href="#" isActive={false} />
            <NavItem label={t('spot')} href="#" isActive={false} />
            <NavDropdown
              label={t('futures')}
              items={[
                { label: t('futures'), description: t('futuresDesc'), href: '#' },
                { label: t('tradingBots'), description: t('tradingBotsDesc'), href: '#' },
                { label: t('demoTrading'), description: t('demoTradingDesc'), href: '#' },
              ]}
            />
            <NavItem label={t('copyTrading')} href="#" isActive={false} />
            <NavItem label={t('earn')} href="#" isActive={false} />
            <NavDropdown
              label={t('more')}
              items={[
                { label: t('rewardsHub'), description: t('rewardsHubDesc'), href: '#' },
                { label: t('activityCenter'), description: t('activityCenterDesc'), href: '#' },
                { label: t('affiliates'), description: t('affiliatesDesc'), href: '#' },
                { label: t('referral'), description: t('referralDesc'), href: '#' },
                { label: t('news'), description: t('newsDesc'), href: '#' },
                { label: t('academy'), description: t('academyDesc'), href: '#' },
              ]}
            />
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

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; description: string; href: string }[];
}) {
  return (
    <div className="relative group">
      <button className="flex items-center text-sm font-medium text-white hover:text-yellow-500">
        {label}
        <ChevronDown size={16} className="ml-1" />
      </button>
      <div className="invisible absolute left-0 top-full z-10 mt-2 w-60 rounded bg-gray-900 py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link key={item.label} href={item.href} className="block px-4 py-2 hover:bg-gray-800">
            <div className="text-sm font-medium text-white">{item.label}</div>
            <div className="text-xs text-gray-400">{item.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}