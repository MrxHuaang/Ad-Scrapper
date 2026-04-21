"use client";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    icon: "⌕",
    label: "Instant full-text search",
    body: "Query 21,000+ ADs across all authorities in milliseconds. Filter by aircraft type, effective date, or regulation number.",
  },
  {
    icon: "◉",
    label: "Automatic compliance alerts",
    body: "Subscribe to aircraft types and get notified the moment a new AD is published or amended — before it affects your fleet.",
  },
  {
    icon: "≡",
    label: "Complete audit traceability",
    body: "Every record links back to the official authority source. Export to PDF for maintenance logs and audit documentation.",
  },
  {
    icon: "↻",
    label: "Daily synchronization",
    body: "Scrapers run every 24 hours against official portals. FAA, EASA, Transport Canada, and ANAC — always current.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,127,0.04) 0%, transparent 72%), radial-gradient(ellipse 45% 35% at 100% 0%, color-mix(in srgb, var(--zl-spectrum-from) 8%, transparent) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00d47f]" />
            Platform Capabilities
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Everything you need for
            <br />
            compliance tracking
          </h2>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease }}
              className="group relative bg-black p-8 transition-all duration-300 hover:bg-[#0a0a0a]"
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--zl-spectrum-line)" }}
              />

              {/* Icon */}
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141414] text-lg text-[#a1a1a1] transition-all duration-300 group-hover:border-white/[0.14] group-hover:bg-[#0f0f0f] group-hover:text-white">
                {f.icon}
              </div>

              <h3 className="mb-3 text-base font-semibold text-white">
                {f.label}
              </h3>
              <p className="text-sm leading-relaxed text-[#737373]">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
