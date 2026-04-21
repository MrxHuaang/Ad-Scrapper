import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { AuthorityCoverage } from "@/components/landing/AuthorityCoverage";
import { StickyAudienceSection } from "@/components/landing/StickyAudienceSection";
import { Footer } from "@/components/landing/Footer";
import Prism from "@/components/landing/Prism";

export const metadata: Metadata = {
  title: "Zephr — Airworthiness Directives",
  description:
    "Search Airworthiness Directives from FAA, EASA, Transport Canada, and ANAC in one place.",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <HeroSection />
        
        {/* Container for everything after the Hero */}
        <div className="relative">
          {/* 
            The Prism background:
            - position absolute filling the entire container height
            - maskImage: invisible at the top to fade perfectly from the black Hero, taking 250px to become fully visible. 
          */}
          <div 
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 150px, black)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 150px, black)"
            }}
          >
            {/* 
              sticky top-0 makes the shader fixed on the screen as you scroll,
              driving a beautiful parallax effect behind the cards.
              We use opacity-30 here instead of turning down the shader glow, 
              so the cloudy volume remains large but subtle.
            */}
            <div className="sticky top-0 h-dvh w-full opacity-30">
              <Prism 
                animationType="rotate"
                timeScale={0.15}
                height={3.5}
                baseWidth={5.5}
                scale={3.6} // Full scale
                hueShift={0}
                colorFrequency={1}
                noise={0.1}
                glow={1} // Restore original glow to maintain full shape volume
                colorSaturation={0} // Grayscale
                transparent={true}
              />
            </div>
          </div>

          {/* Foreground content. Sections now have bg-transparent so the sticky Prism shows through the gaps */}
          <div className="relative z-10 w-full pb-20">
            <ProductPreview />
            <FeaturesGrid />
            <StickyAudienceSection />
            <AuthorityCoverage />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
