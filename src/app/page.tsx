import CryptoTicker from "@/components/main/CryptoTicker/CryptoTicker";
import CtaBlock from "@/components/main/CtaBlock/CtaBlock";
import FAQSection from "@/components/main/FAQSection/FAQSection";
import FeatureCards from "@/components/main/FeatureCards/FeatureCards";
import HeroSection from "@/components/main/HeroSection/HeroSection";
import MarketsSection from "@/components/main/MarketsSection/MarketsSection";
import MobileAppSection from "@/components/main/MobileAppSection/MobileAppSection";
import PartnersSlider from "@/components/main/PartnersSlider/PartnersSlider";
import RoboTradingSection from "@/components/main/RoboTradingSection/RoboTradingSection";
import TradingTypesSection from "@/components/main/TradingTypesSection/TradingTypesSection";
import WhyExchangeSection from "@/components/main/WhyExchangeSection/WhyExchangeSection";
import { Suspense } from "react";


export default async function Home({
}: {
}) {
  // Получаем переводы с сервера
  
  return (
    <div >
      <Suspense fallback={null}>
      <HeroSection/>
      <CryptoTicker/>
      <FeatureCards />
      <MarketsSection />
      <WhyExchangeSection />
      <RoboTradingSection />
      <TradingTypesSection />
      <MobileAppSection/>
      <PartnersSlider/>
      <FAQSection/>
      <CtaBlock/>
      </Suspense>
    </div>
  );
}
