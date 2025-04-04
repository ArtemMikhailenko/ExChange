import Image from "next/image";
import HeroSection from "./components/main/HeroSection/HeroSection";
import CryptoTicker from "./components/main/CryptoTicker/CryptoTicker";
import FeatureCards from "./components/main/FeatureCards/FeatureCards";
import MarketsSection from "./components/main/MarketsSection/MarketsSection";
import WhyExchangeSection from "./components/main/WhyExchangeSection/WhyExchangeSection";
import RoboTradingSection from "./components/main/RoboTradingSection/RoboTradingSection";
import TradingTypesSection from "./components/main/TradingTypesSection/TradingTypesSection";
import MobileAppSection from "./components/main/MobileAppSection/MobileAppSection";
import PartnersSlider from "./components/main/PartnersSlider/PartnersSlider";
import FAQSection from "./components/main/FAQSection/FAQSection";
import CtaBlock from "./components/main/CtaBlock/CtaBlock";

export default function Home() {
  return (
    <div >
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
    </div>
  );
}
