"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/** How many glass tiles in one full loop; duplicated for the seamless track. */
const TILES_PER_TRACK = 12;

function GlassHyventoTile() {
  return (
    <div
      className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl sm:h-24 sm:w-24 md:rounded-[1.25rem]"
      aria-hidden
    >
      <Image
        src="/Hyvento.png"
        alt=""
        width={200}
        height={40}
        className="h-8 w-auto max-w-[90%] object-contain opacity-100 sm:h-10"
        style={{ width: "auto" }}
        sizes="(max-width: 640px) 120px, 160px"
      />
    </div>
  );
}

function TileTrack() {
  return (
    <div className="flex w-max items-center gap-3 pr-3 sm:gap-4 sm:pr-4">
      {Array.from({ length: TILES_PER_TRACK }, (_, i) => (
        <GlassHyventoTile key={i} />
      ))}
    </div>
  );
}

/**
 * Continuous right → left Hyvento wordmark in liquid-glass tiles (nav-style glass).
 */
export function HyventoMarquee() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-black py-16 md:py-20"
      aria-label="Hyvento brand strip"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(255,255,255,0.05) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 20% 60%, color-mix(in srgb, var(--zl-spectrum-from) 6%, transparent) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center lg:px-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#737373] md:mb-4 md:text-xs">
          Trust
        </p>
        <h2
          className="mx-auto max-w-2xl font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-white"
        >
          Built on a solid foundation.
        </h2>
      </div>

      <div
        className="relative z-10 mt-12 w-full overflow-hidden md:mt-14"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          className="flex w-max"
          initial={false}
          animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 48, repeat: Infinity, ease: "linear" }
          }
        >
          <TileTrack />
          <TileTrack />
        </motion.div>
      </div>
    </section>
  );
}
