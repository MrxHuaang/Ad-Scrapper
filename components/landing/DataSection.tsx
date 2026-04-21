"use client";
import { motion } from "framer-motion";

const AUTHORITIES = [
  {
    code: "FAA",
    name: "Federal Aviation Administration",
    region: "United States",
    count: "10,000+",
  },
  {
    code: "EASA",
    name: "European Union Aviation Safety Agency",
    region: "Europe",
    count: "8,000+",
  },
  {
    code: "TC",
    name: "Transport Canada Civil Aviation",
    region: "Canada",
    count: "3,000+",
  },
  {
    code: "ANAC",
    name: "Agência Nacional de Aviação Civil",
    region: "Brazil",
    count: "450+",
  },
  {
    code: "→",
    name: "More authorities in progress",
    region: "Global expansion",
    count: "",
  },
];

const BENEFITS = [
  {
    title: "Instant full-text search",
    body: "Query 21,000+ ADs across all authorities in milliseconds. Filter by aircraft type, effective date, or regulation number.",
  },
  {
    title: "Automatic compliance alerts",
    body: "Subscribe to aircraft types and receive notifications the moment a new AD is published or amended.",
  },
  {
    title: "Complete audit traceability",
    body: "Every record links back to the official authority source. Export to PDF for maintenance documentation.",
  },
  {
    title: "Daily synchronization",
    body: "Our scrapers run every 24 hours against official authority portals, so the database is always current.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function DataSection() {
  return (
    <section id="data" className="bg-[var(--zl-bg)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease }}
          className="max-w-4xl font-[family-name:var(--font-cormorant)] text-[clamp(2rem,5vw,4rem)] leading-[1.08] tracking-[-0.01em] text-[var(--zl-text)]"
        >
          We aggregate real-time compliance data{" "}
          <span className="italic text-white">
            across global aviation authorities
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-[var(--zl-text-2)]"
        >
          Official regulatory data combined with intelligent indexing gives
          aviation maintenance professionals instant access to every applicable
          directive — in one searchable platform.
        </motion.p>

        {/* Divider */}
        <div className="mt-14 h-px w-full bg-white/[0.06]" />

        {/* Two-column grid */}
        <div className="mt-14 grid gap-16 md:grid-cols-2">
          {/* Left: coverage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            <p className="mb-8 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--zl-text-3)]">
              Authority Coverage
            </p>
            <div className="space-y-0">
              {AUTHORITIES.map((a, i) => (
                <div
                  key={a.code}
                  className={`flex items-center gap-5 py-5 ${
                    i < AUTHORITIES.length - 1
                      ? "border-b border-white/[0.06]"
                      : ""
                  }`}
                >
                  <span className="w-11 shrink-0 text-xs font-semibold tracking-widest text-[var(--zl-gold-muted)]">
                    {a.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[var(--zl-text-2)]">
                      {a.name}
                    </p>
                    <p className="text-xs text-[var(--zl-text-3)]">
                      {a.region}
                    </p>
                  </div>
                  {a.count && (
                    <span className="text-xs tabular-nums text-[var(--zl-text-3)]">
                      {a.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <p className="mb-8 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--zl-text-3)]">
              Platform Capabilities
            </p>
            <div className="space-y-9">
              {BENEFITS.map((b) => (
                <div key={b.title}>
                  <p className="text-sm font-semibold text-[var(--zl-text)]">
                    {b.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--zl-text-2)]">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
