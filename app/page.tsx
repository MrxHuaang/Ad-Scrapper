import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { AuthorityTicker } from "@/components/landing/AuthorityTicker";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StickyAudienceSection } from "@/components/landing/StickyAudienceSection";
import { AuthorityCoverage } from "@/components/landing/AuthorityCoverage";
import { FAQ } from "@/components/landing/FAQ";
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

        {/* Social proof — immediately establishes trust */}
        <TrustBar />

        {/* Authority ticker — connects trust bar to product section */}
        <AuthorityTicker />

        {/* Prism + product sections */}
        <div className="relative">
          <div
            className="prism-reveal pointer-events-none absolute inset-0 z-0 overflow-clip"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 48px, rgba(0,0,0,1) 200px, rgba(0,0,0,1) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 48px, rgba(0,0,0,1) 200px, rgba(0,0,0,1) 100%)",
            }}
          >
            <div className="sticky top-0 h-dvh min-h-dvh w-full opacity-30 [transform:translateZ(0)]">
              <Prism
                animationType="rotate"
                timeScale={0.15}
                height={3.5}
                baseWidth={5.5}
                scale={3.6}
                hueShift={0}
                colorFrequency={1}
                noise={0.1}
                glow={1}
                colorSaturation={0}
                transparent={true}
                suspendWhenOffscreen={false}
              />
            </div>
          </div>

          <div className="relative z-10 w-full">
            <ProductPreview />
            <FeaturesGrid />
            <StickyAudienceSection />
            <AuthorityCoverage />
            {/* FAQ inside same layer as coverage — avoids a hard seam + extra empty band */}
            <FAQ />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
