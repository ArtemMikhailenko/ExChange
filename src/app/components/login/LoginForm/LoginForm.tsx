'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TFunction } from 'i18next';
import { authService } from '@/services/api';

interface LoginFormProps {
  isDark: boolean;
  t: TFunction;
  openResetModal: (e: React.MouseEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isDark, t, openResetModal }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Базовая валидация
      if (!email.trim()) {
        throw new Error('Пожалуйста, введите email');
      }
      if (!password) {
        throw new Error('Пожалуйста, введите пароль');
      }

      // Mock reCAPTCHA response (в реальном приложении интегрируйте настоящую reCAPTCHA)
      const recaptchaResponse = '03AGdBq26u-dummy-response';
      console.log('Отправка данных для входа:', { email, password: '********' });

      const result = await authService.login({
        email,
        password,
        'g-recaptcha-response': recaptchaResponse
      });

      console.log('Ответ API:', result);

      if (result.status === 'success' && result.data) {
        // Сохраняем токен
        authService.saveAuthToken(result.data.token);
      } else {
        throw new Error(result.error || 'Ошибка входа. Пожалуйста, попробуйте снова.');
      }
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Не удалось войти. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await authService.googleLogin();

      if (result.status === 'success' && result.data?.url) {
        // Перенаправляем на URL аутентификации Google
        window.location.href = result.data.url;
      } else {
        throw new Error(result.error || 'Не удалось начать аутентификацию через Google');
      }
    } catch (err: any) {
      console.error('Ошибка Google входа:', err);
      setError(err.message || 'Не удалось подключиться к сервисам Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md rounded-2xl p-8 backdrop-blur-sm shadow-xl ${
      isDark 
        ? 'bg-gray-900/70 border border-gray-800'
        : 'bg-white/80 border border-gray-100'
    }`}>
      {/* Заголовок формы */}
      <div className="text-center mb-8 relative">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
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
        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a 
            href="#" 
            onClick={openResetModal}
            className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {t('forgotPassword')}?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-medium text-base transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg active:scale-[0.98] ${
            loading ? 'opacity-70 cursor-not-allowed flex items-center justify-center' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('loggingIn')}...
            </>
          ) : t('logIn')}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
            <div className="w-full border-t border-current"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${isDark ? 'bg-gray-900/70 text-gray-400' : 'bg-white/80 text-gray-500'}`}>
              {t('orContinueWith')}
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            } hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            } hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

        {/* Sign Up Section */}
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
      </form>
    </div>
  );
};

export default LoginForm;
