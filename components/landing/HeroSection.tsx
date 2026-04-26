"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroVisual } from "./HeroVisual";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section className="relative flex h-dvh min-h-[640px] items-center overflow-x-hidden overflow-y-visible">
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


      {/* Radar visual — replaces Spline */}
      <HeroVisual />

      {/* Mobile right-side ambient glow (no 3D model on mobile) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 100% 40%, rgba(232,184,75,0.04), transparent)",
        }}
      />

      {/* Left fade so radar doesn't bleed into text */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] md:block"
        style={{ background: "linear-gradient(to right, black 46%, transparent 100%)" }}
      />

      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32"
        style={{ background: "linear-gradient(to bottom, transparent, black)" }}
      />

      {/* Content */}
      <div className="relative z-[10] mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-xl">

          <motion.h1
            className="font-[family-name:var(--font-cormorant)] text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.97] tracking-[-0.02em] text-white"
          >
            {["Compliance", "tracking"].map((text, i) => (
              <div key={text} className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {text}
                </motion.span>
              </div>
            ))}
            <div className="overflow-hidden">
              <motion.span
                className="italic zl-text-spectrum block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                for aviation.
              </motion.span>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease }}
            className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-[#737373]"
          >
            One platform. Every AD from FAA, EASA, Transport Canada, and ANAC.
            Updated every 24 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/login"
              className="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_2px_24px_rgba(255,255,255,0.1),0_0_48px_-20px_var(--zl-spectrum-glow)] transition-all duration-300 hover:bg-[#f0f0f0] hover:shadow-[0_2px_32px_rgba(255,255,255,0.2),0_0_56px_-18px_var(--zl-spectrum-glow)] active:scale-[0.97]"
            >
              Get Started
            </Link>

            <a
              href="#product"
              className="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm text-[#a1a1a1] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white hover:shadow-[0_0_36px_-20px_var(--zl-spectrum-glow)] active:scale-[0.97]"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
                style={{ background: "var(--zl-spectrum-line)" }}
              />
              See the platform
              <span aria-hidden className="text-base leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
