// src/app/login/page.tsx
'use client';

import React, { Suspense, useState } from 'react';

import { useTheme } from '@/app/context/ThemeContext';
import PasswordResetModal from '../../components/login/PasswordResetModal/PasswordResetModal';
import BackgroundDecoration from '../../components/login/BackgroundDecoration/BackgroundDecoration';
import LoginPromo from '../../components/login/LoginPromo/LoginPromo';
import LoginForm from '../../components/login/LoginForm/LoginForm';


export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Open the password reset modal
  const openResetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResetModalOpen(true);
  };
  
  // Close the password reset modal
  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] relative overflow-hidden">
       <Suspense fallback={null}>
      <BackgroundDecoration isDark={isDark} />
      
      <LoginPromo isDark={isDark}  />
      
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 z-10`}>
        <LoginForm 
          isDark={isDark} 
          
          openResetModal={openResetModal} 
        />
      </div>
      
      <PasswordResetModal 
        isOpen={isResetModalOpen} 
        onClose={closeResetModal} 
      />
      </Suspense>
    </div>
  );
}