"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import dashboardImg from "@/public/dashboard-preview.png";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [30, -60] : [100, -200]);
  const rotateX = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [12, -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [1, 1, 1] : [0.95, 1.02, 0.95]);

  return (
    <section
      ref={containerRef}
      id="product"
      className="relative overflow-hidden bg-black py-24 md:py-48"
      style={{ perspective: isMobile ? "none" : "1500px" }}
    >
      {/* Subtle grey radial gradient — z-0 so bottom feather can stack cleanly */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse, #ffffff 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Bottom vignette: sits on solid bg-black so Prism behind z-10 never bleeds through */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(24vh,200px)]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 55%, #000000 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#a1a1a1]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#52525B]" />
            Platform Overview
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease }}
          className="mb-24 text-center font-[family-name:var(--font-cormorant)] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.01em] text-[#f5f5f5]"
        >
          One dashboard.{" "}
          <span className="italic zl-text-spectrum">Every directive.</span>
        </motion.h2>

        {/* Parallax Wrapper */}
        <motion.div style={{ y, rotateX, scale }}>
          {/* Screenshot card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="relative"
          >
            {/* Subtle white glow behind image */}
            <div
              className="pointer-events-none absolute inset-x-[10%] -top-6 h-16 rounded-full opacity-[0.22]"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in srgb, var(--zl-spectrum-from) 22%, transparent), color-mix(in srgb, var(--zl-spectrum-to) 18%, transparent), rgba(255,255,255,0.06))",
                filter: "blur(36px)",
              }}
            />

            {/* Screenshot container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04),0_0_80px_-40px_var(--zl-spectrum-glow)]">
              {/* Top bar decoration */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#141414] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <div className="ml-3 flex-1 rounded bg-[#1a1a1a] px-3 py-1 text-center text-[10px] text-[#737373]">
                  zephr.app/search
                </div>
              </div>

              {/* The actual screenshot */}
              <div className="relative aspect-[16/9]">
                <Image
                  src={dashboardImg}
                  alt="Zephr dashboard — airworthiness directives search"
                  fill
                  className="object-cover object-top"
                  priority
                  unoptimized
                />
                {/* Subtle bottom vignette */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
              </div>
            </div>

            {/* Floating stat pills */}
            <div className="absolute -left-4 bottom-12 hidden md:block">
              <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#737373]">
                  Total ADs indexed
                </p>
                <p className="mt-1 text-2xl font-bold text-white">28,431</p>
              </div>
            </div>

            <div className="absolute -right-4 top-16 hidden md:block">
              <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#737373]">
                  Updated
                </p>
                <p className="mt-1 text-sm font-semibold zl-text-spectrum">
                  Every 24 h
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
