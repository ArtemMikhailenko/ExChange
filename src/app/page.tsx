import Image from "next/image";
import HeroSection from "./components/HeroSection/HeroSection";
import CryptoTicker from "./components/CryptoTicker/CryptoTicker";
import FeatureCards from "./components/FeatureCards/FeatureCards";
import MarketsSection from "./components/MarketsSection/MarketsSection";
import WhyExchangeSection from "./components/WhyExchangeSection/WhyExchangeSection";
import RoboTradingSection from "./components/RoboTradingSection/RoboTradingSection";
import TradingTypesSection from "./components/TradingTypesSection/TradingTypesSection";
import MobileAppSection from "./components/MobileAppSection/MobileAppSection";
import PartnersSlider from "./components/PartnersSlider/PartnersSlider";
import FAQSection from "./components/FAQSection/FAQSection";
import CtaBlock from "./components/CtaBlock/CtaBlock";

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
