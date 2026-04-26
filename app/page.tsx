import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BrandMarquee } from "@/components/landing/BrandMarquee";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StickyAudienceSection } from "@/components/landing/StickyAudienceSection";
import { AuthorityCoverage } from "@/components/landing/AuthorityCoverage";
import { FAQ } from "@/components/landing/FAQ";
import { SectionTransition } from "@/components/landing/SectionTransition";
import { Footer } from "@/components/landing/Footer";
import { PrismWrapper } from "@/components/landing/PrismWrapper";

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

        {/* Dynamic marquee for coverage confidence */}
        <BrandMarquee />

        {/* Prism + product sections */}
        <div className="relative">
          {/*
            Prism: no top mask (old 0→200px fade hid the full Product / “One dashboard” block).
            Hero + Brand are outside this wrapper; first pixels here = Platform Overview. */}
          <div className="prism-reveal pointer-events-none absolute inset-0 z-0 overflow-clip">
            <div className="sticky top-0 h-dvh min-h-dvh w-full opacity-[0.34] [transform:translateZ(0)] sm:opacity-40">
              <PrismWrapper
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
          {/* Neutral grey air over Prism (bridges product → features) */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: [
                "radial-gradient(ellipse 100% 85% at 50% 6%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 38%, transparent 65%)",
                "radial-gradient(ellipse 110% 75% at 50% 42%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 40%, transparent 68%)",
                "radial-gradient(ellipse 95% 50% at 50% 94%, rgba(255, 255, 255, 0.034) 0%, transparent 58%)",
              ].join(", "),
            }}
            aria-hidden
          />

          <div className="relative z-10 w-full">
            {/* ProductPreview contains "Platform Overview" */}
            <ProductPreview />
            <FeaturesGrid />
            <StickyAudienceSection />
            <SectionTransition type="curve" className="-mt-1" />
            <AuthorityCoverage />
          </div>
        </div>

        {/* FAQ — handle objections before checkout */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
