import HeroSection from "@/components/HeroSection";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import ToolCardsGrid from "@/components/ToolCardsGrid";
import PricingAndFaqSection from "@/components/PricingAndFaqSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ShowcaseCarousel />
      <ToolCardsGrid />
      <PricingAndFaqSection />
    </div>
  );
}
