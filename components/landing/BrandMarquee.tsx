"use client";

import { motion } from "framer-motion";
import React from "react";

const BRANDS = [
  { name: "Boeing", logo: "BOEING" },
  { name: "Airbus", logo: "AIRBUS" },
  { name: "Embraer", logo: "EMBRAER" },
  { name: "Gulfstream", logo: "GULFSTREAM" },
  { name: "Cessna", logo: "CESSNA" },
  { name: "Bombardier", logo: "BOMBARDIER" },
  { name: "Piper", logo: "PIPER" },
  { name: "Beechcraft", logo: "BEECHCRAFT" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function BrandMarquee() {
  // Duplicate for seamless loop
  const doubleBrands = [...BRANDS, ...BRANDS];

  return (
    <section className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Background decoration: Subtle glow */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #e8b84b 0%, transparent 70%)",
          filter: "blur(80px)"
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            Trust
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Our coverage.
          </h2>
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden py-4">
        <motion.div
          className="flex whitespace-nowrap gap-6 px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {doubleBrands.map((brand, i) => (
            <div
              key={i}
              className="group relative flex h-44 w-44 md:h-52 md:w-52 items-center justify-center rounded-[32px] overflow-hidden"
            >
              {/* Liquid Glass Effect */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 group-hover:bg-white/[0.06]" />
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" 
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)"
                }}
              />
              
              {/* Inner shadow/border for depth */}
              <div className="absolute inset-px rounded-[31px] border border-white/[0.05] pointer-events-none" />

              <span className="relative z-10 font-serif text-xl md:text-2xl font-bold tracking-tighter text-white/50 group-hover:text-white transition-colors duration-500 uppercase">
                {brand.logo}
              </span>

              {/* Hover Glow */}
              <div className="absolute -inset-10 bg-[#e8b84b]/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            </div>
          ))}
        </motion.div>
        
        {/* Masking gradients for the edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20" />
      </div>
    </section>
  );
}
