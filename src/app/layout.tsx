// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProviderWrapper } from './theme-provider-wrapper';
import Header from './components/Header/Header';
import '@/i18n';
import Footer from './components/Footer/Footer';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Оборачиваем children в клиентский провайдер */}
        <ThemeProviderWrapper>
          <div className="min-h-screen">
            <Header />
            {children}
            <Footer/>
          </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}