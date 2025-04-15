// src/app/signup/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import BackgroundDecoration from '../../components/login/BackgroundDecoration/BackgroundDecoration';
import LoginPromo from '../../components/login/LoginPromo/LoginPromo';
import SignupForm from '../../components/signup/SignupForm/SignupForm';

export default function SignupPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';

  return (
    <div className="flex min-h-[calc(100vh-64px)] relative overflow-hidden">
      <Suspense fallback={null}>
      <BackgroundDecoration isDark={isDark} />
      
      <LoginPromo isDark={isDark}  />
      
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 z-10`}>
        <SignupForm isDark={isDark} />
      </div>
      </Suspense>
    </div>
  );
}