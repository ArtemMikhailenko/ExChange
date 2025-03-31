// src/app/theme-provider-wrapper.tsx
'use client';

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
