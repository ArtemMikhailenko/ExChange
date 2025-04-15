'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/app/context/TranslationContext';

interface SignupFormProps {
  isDark: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ isDark }) => {
  const router = useRouter();
  const { register, loading, error: authError, clearError } = useAuth();
    const { t, lang } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    referralCode: ''
  });
  
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isReferralFocused, setIsReferralFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const error = authError || localError;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleReferralField = () => {
    setShowReferralField(!showReferralField);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError();
    setLocalError(null);
    setSuccessMessage(null);
    
    if (!formData.email) {
      setLocalError(t('emailRequired'));
      return;
    }
    
    if (!formData.password) {
      setLocalError(t('passwordRequired'));
      return;
    }
    
    if (!agreedToTerms) {
      setLocalError(t('termsRequired'));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError(t('invalidEmail'));
      return;
    }
    
    if (formData.password.length < 8) {
      setLocalError(t('passwordTooShort'));
      return;
    }
    
    const success = await register({
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode || undefined
    });
    
    if (success) {
      setSuccessMessage(t('registrationSuccess'));
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className={`w-full max-w-md rounded-2xl p-8 backdrop-blur-sm shadow-xl ${
      isDark 
        ? 'bg-gray-900/70 border border-gray-800'
        : 'bg-white/80 border border-gray-100'
    }`}>
      <div className="text-center mb-8 relative">
        <h2 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {t('welcomeToExchange')}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Create an account to start trading
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
          {successMessage}
        </div>
      )}
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email field */}
        <div className={`relative transition-all duration-300 ${isEmailFocused ? 'scale-[1.02]' : ''}`}>
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
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/70 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20' 
                : 'bg-white text-gray-900 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30'
            } focus:outline-none`}
            placeholder={t('emailOrPhone')}
          />
        </div>
        
        {/* Password field */}
        <div className={`relative transition-all duration-300 ${isPasswordFocused ? 'scale-[1.02]' : ''}`}>
          <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM18 8C19.1 8 20 8.9 20 10V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10C4 8.9 4.9 8 6 8H7V6C7 3.24 9.24 1 12 1C14.76 1 17 3.24 17 6V8H18ZM12 3C10.34 3 9 4.34 9 6V8H15V6C15 4.34 13.66 3 12 3Z" fill="currentColor"/>
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            className={`w-full pl-12 pr-12 py-4 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/70 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20' 
                : 'bg-white text-gray-900 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30'
            } focus:outline-none`}
            placeholder={t('password')}
          />
          <button 
            type="button"
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div>
          <button
            type="button"
            onClick={toggleReferralField}
            className={`flex items-center justify-between w-full py-2 px-4 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 border border-gray-700/50' 
                : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100/80 border border-gray-200/50'
            }`}
          >
            <span className="flex items-center">
              <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>{t('referralCode')}</span>
              <span className="ml-2 text-sm opacity-60">({t('optional')})</span>
            </span>
            {showReferralField ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          <div className={`mt-3 overflow-hidden transition-all duration-300 ${
            showReferralField ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className={`relative transition-all duration-300 ${isReferralFocused ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                onFocus={() => setIsReferralFocused(true)}
                onBlur={() => setIsReferralFocused(false)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/70 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20' 
                    : 'bg-white text-gray-900 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30'
                } focus:outline-none`}
                placeholder={t('enterReferralCode')}
              />
            </div>
          </div>
        </div>
        
        {/* Terms and conditions */}
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-gray-50/80 border border-gray-200/50'
        }`}>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="h-4 w-4 rounded border border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className={`${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('iHaveRead')} {t('andAgreedTo')} {t('bioFin')} 
                <Link href="/terms" className="text-yellow-500 hover:text-yellow-600 mx-1">
                  {t('termsOfService')}
                </Link>
                {t('and')}
                <Link href="/privacy" className="text-yellow-500 hover:text-yellow-600 mx-1">
                  {t('privatePolicy')}
                </Link>
                {t('and')}
                <Link href="/risk" className="text-yellow-500 hover:text-yellow-600 mx-1">
                  {t('riskDisclosure')}
                </Link>
              </label>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!agreedToTerms || loading}
          className={`w-full py-4 px-6 rounded-xl font-medium text-base transition-all duration-300 ${
            agreedToTerms && !loading
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg active:scale-[0.98] cursor-pointer' 
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          } flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('processing')}
            </>
          ) : (
            t('signUp')
          )}
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
              width={18}
              height={18}
            />
            Apple
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {t('alreadyHaveAccount')}{' '}
          <Link 
            href="/login" 
            className="text-yellow-500 hover:text-yellow-600 font-medium"
          >
            {t('logIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;