// src/app/layout.tsx (или app/layout.tsx)
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/AuthProvider';
import { Suspense } from "react";
import { ThemeProviderWrapper } from './theme-provider-wrapper';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { TranslationProvider } from '@/app/context/TranslationContext';

export const metadata: Metadata = {
  title: 'ExChange',
  description: 'Multi-language & theming example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Обязательно */}
      <head />
      <body>
      <Suspense fallback={null}>
      <TranslationProvider>
        <ThemeProviderWrapper>
          <AuthProvider>
            <div className="min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProviderWrapper>
        </TranslationProvider>
        </Suspense>
      </body>
    </html>
  );
}
