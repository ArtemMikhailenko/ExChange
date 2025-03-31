'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Globe,
  Linkedin
} from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row">
          {/* Logo column */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-8">
              <div className="flex items-center text-white">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 1C30.493 1 39 9.507 39 20C39 30.493 30.493 39 20 39" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="ml-2 text-xl font-bold">Logoipsum</span>
              </div>
            </Link>
          </div>

          {/* Center navigation columns */}
          <div className="lg:w-2/4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 lg:mb-0">
            {/* COMMUNITIES */}
            <div>
              <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
                {t('communities')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/for-companies" className="hover:text-white transition-colors">
                    {t('forCompanies')}
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="hover:text-white transition-colors">
                    {t('developers')}
                  </Link>
                </li>
                <li>
                  <Link href="/advertising" className="hover:text-white transition-colors">
                    {t('advertising')}
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="hover:text-white transition-colors">
                    {t('investors')}
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="hover:text-white transition-colors">
                    {t('vendors')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
                {t('company')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors">
                    {t('jobs')}
                  </Link>
                </li>
                <li>
                  <Link href="/for-the-record" className="hover:text-white transition-colors">
                    {t('forTheRecord')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* USEFUL LINKS */}
            <div>
              <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
                {t('usefulLinks')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    {t('support')}
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-app" className="hover:text-white transition-colors">
                    {t('freeMobileApp')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons aligned to the right */}
          <div className="lg:w-1/4 flex lg:justify-end">
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="https://facebook.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://instagram.com/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://t.me/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                aria-label="Telegram"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="https://linkedin.com/company/exchange"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom footer with legal links */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <Link href="/legal" className="text-sm hover:text-white transition-colors">
              {t('legal')}
            </Link>
            <Link href="/privacy-center" className="text-sm hover:text-white transition-colors">
              {t('privacyCenter')}
            </Link>
            <Link href="/privacy-policy" className="text-sm hover:text-white transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/cookies" className="text-sm hover:text-white transition-colors">
              {t('cookies')}
            </Link>
            <Link href="/about-ads" className="text-sm hover:text-white transition-colors">
              {t('aboutAds')}
            </Link>
            <Link href="/accessibility" className="text-sm hover:text-white transition-colors">
              {t('accessibility')}
            </Link>
            <Link href="/your-privacy-choice" className="text-sm hover:text-white transition-colors">
              {t('yourPrivacyChoice')}
            </Link>
          </div>
          <div className="text-sm">
            © 2023 Figma Template | {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
}