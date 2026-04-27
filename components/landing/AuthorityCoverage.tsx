"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useScroll, motion, MotionValue } from "framer-motion";

// Three.js bundle only loads when section enters viewport
const AirplaneCanvas = dynamic(
  () => import("./AirplaneCanvas").then((m) => m.AirplaneCanvas),
  { ssr: false, loading: () => null }
);

const STATS = [
  { value: "28,431", label: "Directives indexed" },
  { value: "4", label: "Global authorities" },
  { value: "24 h", label: "Sync cadence" },
  { value: "100%", label: "Official sources" },
];

export function AuthorityCoverage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canvasVisible, setCanvasVisible] = useState(false);

  // Only mount Three.js when section enters viewport — avoids loading on page init
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCanvasVisible(true); },
      { rootMargin: "200px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section id="regulators" ref={sectionRef} className="relative bg-black">
      <div ref={containerRef} style={{ height: "200vh" }}>
        <div className="sticky top-0 h-dvh overflow-hidden">

          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 50% 55%, rgba(232,184,75,0.06) 0%, transparent 60%)",
            }}
            aria-hidden
          />

          {/* Canvas — only mounts after IntersectionObserver fires */}
          {canvasVisible && (
            <div className="absolute inset-0 z-[1]">
              <AirplaneCanvas scrollYProgress={scrollYProgress} />
            </div>
          )}

          {/* Top fade */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-36"
            style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }}
            aria-hidden
          />
          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36"
            style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }}
            aria-hidden
          />

          {/* Headline */}
          <div className="absolute inset-x-0 top-16 z-30 flex flex-col items-center px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3f3f]"
            >
              Global Coverage
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="font-[family-name:var(--font-cormorant)] text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-white"
            >
              Every directive.{" "}
              <span className="italic zl-text-spectrum">Every authority.</span>
            </motion.h2>
          </div>

          {/* Stats row */}
          <div className="absolute inset-x-0 bottom-16 z-30 px-8 lg:px-16">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="text-center"
                >
                  <p className="font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-none text-white">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
