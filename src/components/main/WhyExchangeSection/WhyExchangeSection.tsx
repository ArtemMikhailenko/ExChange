"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

type FeatureItem = {
  iconSrc: string;
  title: string;
  description: string;
};

export default function WhyExchangeSection() {
  const { t, lang } = useTranslation();

  const topRowFeatures: FeatureItem[] = [
    {
      iconSrc: "/images/why/icon1.svg",
      title: t("reliableSecurity"),
      description: t("reliableSecurityDesc"),
    },
    {
      iconSrc: "/images/why/icon2.svg",
      title: t("derivativesTrading"),
      description: t("derivativesTradingDesc"),
    },
    {
      iconSrc: "/images/why/icon3.svg",
      title: t("stableAndSeamless"),
      description: t("stableAndSeamlessDesc"),
    },
    {
      iconSrc: "/images/why/icon4.svg",
      title: t("highPerformance"),
      description: t("highPerformanceDesc"),
    },
  ];

  const bottomRowFeatures: FeatureItem[] = [
    {
      iconSrc: "/images/why/icon5.svg",
      title: t("minimumCommissions"),
      description: t("minimumCommissionsDesc"),
    },
    {
      iconSrc: "/images/why/icon6.svg",
      title: t("fastDeposits"),
      description: t("fastDepositsDesc"),
    },
    {
      iconSrc: "/images/why/icon7.svg",
      title: t("highestSecurity"),
      description: t("highestSecurityDesc"),
    },
    {
      iconSrc: "/images/why/icon8.svg",
      title: t("smartTradingTools"),
      description: t("smartTradingToolsDesc"),
    },
  ];

  return (
    <section className="py-20 bg-[#0D0D0D] dark:bg-[#0D0D0D] mt-10 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center pb-20 text-white dark:text-white">
          {t("whyExchange")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {topRowFeatures.map((feature, index) => (
            <div key={`top-${index}`} className="flex flex-col items-center text-center">
              <div className="mb-6 w-18 h-18 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-800 ">
                <Image 
                  src={feature.iconSrc} 
                  alt={feature.title}
                  width={45}
                  height={45}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bottomRowFeatures.map((feature, index) => (
            <div key={`bottom-${index}`} className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-800 ">
                <Image 
                  src={feature.iconSrc} 
                  alt={feature.title}
                  width={37}
                  height={37}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
