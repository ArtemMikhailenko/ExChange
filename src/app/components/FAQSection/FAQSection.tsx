'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const { t } = useTranslation('common');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Список часто задаваемых вопросов
  const faqItems: FAQItem[] = [
    {
      question: t('faqProductsQuestion'),
      answer: t('faqProductsAnswer')
    },
    {
      question: t('faqSecurityQuestion'),
      answer: t('faqSecurityAnswer')
    },
    {
      question: t('faqBuyQuestion'),
      answer: t('faqBuyAnswer')
    },
    {
      question: t('faqTradeQuestion'),
      answer: t('faqTradeAnswer')
    }
  ];

  // Функция для переключения состояния открытия/закрытия вопроса
  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">FAQ</h2>
          <Link 
            href="/faq" 
            className="text-yellow-500 hover:text-yellow-400 flex items-center"
          >
            {t('more')}
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="border-b border-gray-800"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="py-6 w-full flex justify-between items-center text-left hover:text-gray-300 focus:outline-none"
              >
                <span className="text-xl font-medium text-left">
                  {item.question}
                </span>
                <span className="text-2xl">
                  {openIndex === index ? 
                    <PlusIcon className="rotate-45 transition-transform duration-300" /> : 
                    <PlusIcon className="transition-transform duration-300" />
                  }
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-gray-400">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Компонент иконки "Плюс"
function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 5V19M5 12H19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}