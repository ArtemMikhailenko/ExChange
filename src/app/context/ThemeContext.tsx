'use client';

import React, { createContext, useState, useEffect } from 'react';

type ThemeContextProps = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Инициализируем state с null, чтобы избежать гидрации при SSR
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

  useEffect(() => {
    // Получаем сохраненную тему из localStorage
    const storedTheme = localStorage.getItem('theme');
    // Получаем предпочтение системы
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Определяем начальную тему
    const initialTheme = storedTheme === 'light' ? 'light' : 
                         storedTheme === 'dark' ? 'dark' : 
                         prefersDark ? 'dark' : 'light';
    
    setTheme(initialTheme);
    
    // Применяем класс к HTML
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      
      // Применяем класс к HTML
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('theme', newTheme);
      
      return newTheme;
    });
  };

  // Не рендерим детей, пока не определена тема (только на клиенте)
  if (theme === null) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}