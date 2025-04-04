// src/app/signup/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@/app/context/ThemeContext';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundDecoration from '../components/login/BackgroundDecoration/BackgroundDecoration';
import LoginPromo from '../components/login/LoginPromo/LoginPromo';
import SignupForm from '../components/signup/SignupForm/SignupForm';

export default function SignupPage() {
  const { t } = useTranslation('common');
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const isDark = theme === 'dark';

  return (
    <div className="flex min-h-[calc(100vh-64px)] relative overflow-hidden">
      <BackgroundDecoration isDark={isDark} />
      
      <LoginPromo isDark={isDark} t={t} />
      
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 z-10`}>
        <SignupForm isDark={isDark} t={t} />
      </div>
    </div>
  );
}