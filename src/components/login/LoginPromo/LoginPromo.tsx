'use client'
import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginPromoProps {
  isDark: boolean;
}

const LoginPromo: React.FC<LoginPromoProps> = ({ isDark }) => {
  const { t, lang } = useTranslation();

  return (
    <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-12 relative ">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center">
          <span className={`inline-block w-12 h-1 bg-yellow-500 mr-4`}></span>
          <span className={`text-sm uppercase tracking-wider font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
            Cryptocurrency Exchange
          </span>
        </div>
        
        <h1 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {t('join')} <span className="text-yellow-500">ExChange</span> {t('today')}
        </h1>
        
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('welcomeBonus')} {t('upTo')} 5,000 USD
        </h2>
        
        <p className={`mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Trade confidently with the world's fastest growing cryptocurrency exchange platform
        </p>
        
        <FeaturesList isDark={isDark} />
        
        <div className="relative w-full h-80">
          <Image 
            src="/images/login/login.png" 
            alt="Welcome bonus illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

interface FeaturesListProps {
  isDark: boolean;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ isDark }) => {
  const features = [
    'Trade 100+ cryptocurrencies with low fees',
    'Advanced security features to protect your assets',
    'Easy-to-use platform for beginners and experts'
  ];

  return (
    <div className="space-y-4 mb-12">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <div className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
            isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/20 text-yellow-600'
          }`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</p>
        </div>
      ))}
    </div>
  );
};

export default LoginPromo;