'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function CtaBlock() {
  const { t, lang } = useTranslation();
  
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold  text-center mb-10">
          {t('startCryptoJourney')}
        </h2>
        
        <Link 
          href="/signup" 
          className="inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-8 py-3 rounded-[10px] transition-colors"
        >
          {t('signUp')}
          <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </section>
  );
}