'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@/app/context/ThemeContext';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t } = useTranslation('common');
  const { theme } = useContext(ThemeContext);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const isDark = theme === 'dark';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock reCAPTCHA response (in a real app you would implement actual reCAPTCHA)
      const recaptchaResponse = '03AGdBq26u-dummy-response';
      
      const response = await fetch('https://apiexchange.ymca.one/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          'g-recaptcha-response': recaptchaResponse
        }),
        credentials: 'include' // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      if (data.status === 'success') {
        // Redirect to dashboard or home page
        router.push('/dashboard');
      } else {
        throw new Error(data.msg || 'Something went wrong');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('https://apiexchange.ymca.one/user/signin/google');
      const data = await response.json();
      
      if (data.status === 'success' && data.url) {
        window.location.href = data.url; // Redirect to Google OAuth
      } else {
        setError('Failed to start Google authentication');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to connect to Google services');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
            : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50'
        }`}></div>
        
        {/* Decorative circles */}
        <div className={`absolute -top-20 -right-20 w-96 h-96 rounded-full ${
          isDark ? 'bg-yellow-500/5' : 'bg-yellow-500/10'
        }`}></div>
        <div className={`absolute -bottom-40 -left-20 w-80 h-80 rounded-full ${
          isDark ? 'bg-yellow-600/5' : 'bg-yellow-400/10'
        }`}></div>
        
        {/* Grid pattern */}
        <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'invert-0' : 'invert'}`} 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}>
        </div>
      </div>
      
      {/* Left half - promo section */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-12 relative z-10">
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
          
          {/* Features list */}
          <div className="space-y-4 mb-12">
            {[
              'Trade 100+ cryptocurrencies with low fees',
              'Advanced security features to protect your assets',
              'Easy-to-use platform for beginners and experts'
            ].map((feature, index) => (
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
          
          {/* 3D crypto illustration */}
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
      
      {/* Right half - login form */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 z-10`}>
        <div className={`w-full max-w-md rounded-2xl p-8 backdrop-blur-sm shadow-xl ${
          isDark 
            ? 'bg-gray-900/70 border border-gray-800'
            : 'bg-white/80 border border-gray-100'
        }`}>
          <div className="text-center mb-8 relative">
            <h2 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {t('welcomeBack')}
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your account to continue
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className={`relative transition-all duration-300 ${isInputFocused ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/70 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20' 
                    : 'bg-white text-gray-900 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30'
                } focus:outline-none`}
                placeholder={t('emailOrPhone')}
              />
            </div>
            
            <div className="relative">
              <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="currentColor"/>
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/70 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20' 
                    : 'bg-white text-gray-900 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30'
                } focus:outline-none`}
                placeholder={t('password')}
              />
            </div>
            
            <div className="flex justify-end">
              <Link 
                href="/password-reset" 
                className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {t('forgotPassword')}?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-medium text-base transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg active:scale-[0.98] ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('loggingIn') + '...' : t('logIn')}
            </button>
            
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${
                isDark ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <div className="w-full border-t border-current"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${
                  isDark ? 'bg-gray-900/70 text-gray-400' : 'bg-white/80 text-gray-500'
                }`}>
                  {t('orContinueWith')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                } hover:scale-[1.02] active:scale-[0.98]`}
              >
                <Image 
                  src="/images/login/google.svg" 
                  alt="Google"
                  width={18}
                  height={18}
                />
                Google
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                } hover:scale-[1.02] active:scale-[0.98]`}
              >
                <Image 
                  src="/images/login/apple.svg" 
                  alt="Apple"
                  width={22}
                  height={22}
                />
                Apple
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {t('dontHaveAccount')}{' '}
              <Link 
                href="/signup" 
                className="text-yellow-500 hover:text-yellow-600 font-medium"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}