import './globals.css';
import type { Metadata } from 'next';
import { ThemeProviderWrapper } from './theme-provider-wrapper';
import Header from './components/Header/Header';
import '@/i18n';
import Footer from './components/Footer/Footer';
import { AuthProvider } from '@/providers/AuthProvider';

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
        <ThemeProviderWrapper>
        <AuthProvider>
          <div className="min-h-screen">
            <Header />
            {children}
            <Footer/>
          </div>
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}