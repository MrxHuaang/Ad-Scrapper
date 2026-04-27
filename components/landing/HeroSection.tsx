"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeroVisual } from "./HeroVisual";
import { LandingSectionLink } from "@/components/landing/LandingSectionLink";

gsap.registerPlugin(useGSAP);

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Words slide up from overflow-hidden containers
      tl.from(".hero-word", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
      })
        .from(
          ".hero-tagline",
          { opacity: 0, y: 18, duration: 0.7 },
          "-=0.5"
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 },
          "-=0.45"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex h-dvh min-h-[640px] items-center overflow-x-hidden overflow-y-visible"
    >
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Ambient wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 48% at 50% -8%, rgba(0,210,120,0.06) 0%, transparent 68%), radial-gradient(ellipse 55% 45% at 92% 18%, rgba(255,255,255,0.04) 0%, transparent 55%)",
        }}
      />

      {/* Radar visual */}
      <HeroVisual />

      {/* Mobile right-side ambient glow */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 100% 40%, rgba(232,184,75,0.04), transparent)",
        }}
      />

      {/* Left fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] md:block"
        style={{ background: "linear-gradient(to right, black 46%, transparent 100%)" }}
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32"
        style={{ background: "linear-gradient(to bottom, transparent, black)" }}
      />

      {/* Content */}
      <div className="relative z-[10] mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.97] tracking-[-0.02em] text-white">
            {["Compliance", "tracking"].map((text) => (
              <div key={text} className="overflow-hidden">
                <span className="hero-word block">{text}</span>
              </div>
            ))}
            <div className="overflow-hidden">
              <span className="hero-word italic zl-text-spectrum block">for aviation.</span>
            </div>
          </h1>

          <p className="hero-tagline mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-[#737373]">
            One platform. Every AD from FAA, EASA, Transport Canada, and ANAC.
            Updated every 24 hours.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="hero-cta group inline-flex items-center gap-1.5 rounded-full bg-white py-2.5 pl-5 pr-1.5 text-sm font-semibold text-black shadow-[0_2px_24px_rgba(255,255,255,0.1),0_0_48px_-20px_var(--zl-spectrum-glow)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_2px_32px_rgba(255,255,255,0.2),0_0_56px_-18px_var(--zl-spectrum-glow)] active:scale-[0.97] sm:gap-2 sm:pl-6 sm:pr-2 sm:py-3"
            >
              Get Started
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white sm:h-8 sm:w-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="h-3.5 w-3.5 sm:h-3 sm:w-3"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            <LandingSectionLink
              sectionId="product"
              className="hero-cta group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm text-[#a1a1a1] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white hover:shadow-[0_0_36px_-20px_var(--zl-spectrum-glow)] active:scale-[0.97]"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
                style={{ background: "var(--zl-spectrum-line)" }}
              />
              See the platform
              <span aria-hidden className="text-base leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </LandingSectionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
