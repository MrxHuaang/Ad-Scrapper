"use client";

import { motion } from "framer-motion";
import { Search, Bell, FileCheck, RefreshCw } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Mini illustrations inside cards ── */

function SearchIllustration() {
  return (
    <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-[11px]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 text-white/20">
        <Search size={10} />
        <span className="text-white/30">boeing 737 rudder</span>
        <span className="ml-auto rounded bg-[#e8b84b]/10 px-1.5 py-0.5 text-[10px] text-[#e8b84b]">
          214 results
        </span>
      </div>
      {[
        { code: "2024-09-12", auth: "FAA", title: "Boeing 737 — Rudder System" },
        { code: "2024-07-03", auth: "EASA", title: "B737 Rudder Travel Limiter" },
        { code: "2023-11-28", auth: "TC", title: "737 Rudder Control System" },
      ].map((r) => (
        <div key={r.code} className="flex items-center gap-2 border-b border-white/[0.04] py-1.5 last:border-0">
          <span className="w-20 shrink-0 text-white/20">{r.code}</span>
          <span className="rounded px-1 text-[9px] font-semibold text-[#e8b84b]">{r.auth}</span>
          <span className="truncate text-white/35">{r.title}</span>
        </div>
      ))}
    </div>
  );
}

function AlertIllustration() {
  return (
    <div className="mt-6 space-y-2">
      {[
        { label: "Boeing 737", active: true },
        { label: "Airbus A320", active: true },
        { label: "Cessna 172", active: false },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
        >
          <span className="text-[12px] text-white/40">{item.label}</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: item.active ? "#e8b84b" : "rgba(255,255,255,0.12)" }}
              animate={item.active ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="text-[10px] text-white/20">{item.active ? "watching" : "off"}</span>
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-[#e8b84b]/20 bg-[#e8b84b]/[0.04] px-3 py-2">
        <p className="text-[10px] font-medium text-[#e8b84b]">New AD: FAA-2024-09-12</p>
        <p className="mt-0.5 text-[10px] text-white/25">Boeing 737 — matches your fleet</p>
      </div>
    </div>
  );
}

function AuditIllustration() {
  return (
    <div className="mt-5 space-y-1.5">
      {[
        { ts: "09:14", action: "AD FAA-2024-09-12 reviewed", color: "#e8b84b" },
        { ts: "09:02", action: "Export PDF generated", color: "rgba(255,255,255,0.3)" },
        { ts: "Yesterday", action: "EASA AD saved to fleet record", color: "rgba(255,255,255,0.3)" },
      ].map((ev) => (
        <div key={ev.action} className="flex items-start gap-2.5">
          <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ev.color }} />
          <div>
            <p className="text-[11px] leading-snug text-white/35">{ev.action}</p>
            <p className="text-[10px] text-white/18">{ev.ts}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SyncIllustration() {
  return (
    <div className="mt-5 flex items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw size={14} className="text-[#e8b84b]/60" />
      </motion.div>
      <div>
        <p className="text-[11px] text-white/35">Last sync: <span className="text-white/55">2 h ago</span></p>
        <p className="text-[10px] text-white/20">Next: in 22 h</p>
      </div>
      <div className="ml-auto rounded-full border border-[#00d47f]/20 bg-[#00d47f]/[0.06] px-2 py-0.5 text-[10px] text-[#00d47f]">
        live
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Search,
    label: "Instant full-text search",
    body: "Query 28,000+ ADs across all authorities in milliseconds. Filter by aircraft type, effective date, or regulation number.",
    illustration: <SearchIllustration />,
    size: "large",
  },
  {
    icon: Bell,
    label: "Automatic compliance alerts",
    body: "Subscribe to aircraft types and get notified the moment a new AD is published or amended — before it affects your fleet.",
    illustration: <AlertIllustration />,
    size: "tall",
  },
  {
    icon: FileCheck,
    label: "Complete audit traceability",
    body: "Every record links back to the official authority source. Export to PDF for maintenance logs and audit documentation.",
    illustration: <AuditIllustration />,
    size: "normal",
  },
  {
    icon: RefreshCw,
    label: "Daily synchronization",
    body: "Scrapers run every 24 hours against official portals. FAA, EASA, Transport Canada, and ANAC — always current.",
    illustration: <SyncIllustration />,
    size: "normal",
  },
] as const;

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="relative bg-transparent py-24 md:py-32"
    >
      {/* Glow anchored at top edge so it bleeds up into product — avoids a second “band” line */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(ellipse 130% 90% at 50% 0%, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.02) 38%, transparent 62%)",
            "radial-gradient(ellipse 95% 55% at 50% 100%, rgba(255, 255, 255, 0.03) 0%, transparent 58%)",
          ].join(", "),
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            Platform Capabilities
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Everything you need for
            <br />
            compliance tracking
          </h2>
        </motion.div>

        {/*
          Bento grid — 3 columns:
          Row 1: [Feature 1 — col-span-2] [Feature 2 — col-span-1, row-span-2]
          Row 2: [Feature 3 — col-span-1] [Feature 4 — col-span-1]
        */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {/* Feature 1 — large (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0, ease }}
            className="group relative rounded-2xl bg-black p-7 transition-colors duration-300 hover:bg-[#090909] sm:col-span-2"
          >
            <SpectrumTopEdge />
            <div className="flex items-start justify-between gap-4">
              <div>
                <IconBadge icon={FEATURES[0].icon} />
                <h3 className="mt-4 text-base font-semibold text-white">{FEATURES[0].label}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#737373]">{FEATURES[0].body}</p>
              </div>
              <div className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono text-[11px] tabular-nums text-white/20">
                28,431
              </div>
            </div>
            {FEATURES[0].illustration}
          </motion.div>

          {/* Feature 2 — tall (1/3 width, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.07, ease }}
            className="group relative rounded-2xl bg-black p-7 transition-colors duration-300 hover:bg-[#090909] sm:row-span-2"
          >
            <SpectrumTopEdge />
            <IconBadge icon={FEATURES[1].icon} />
            <h3 className="mt-4 text-base font-semibold text-white">{FEATURES[1].label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#737373]">{FEATURES[1].body}</p>
            {FEATURES[1].illustration}
          </motion.div>

          {/* Feature 3 — normal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.11, ease }}
            className="group relative rounded-2xl bg-black p-7 transition-colors duration-300 hover:bg-[#090909]"
          >
            <SpectrumTopEdge />
            <IconBadge icon={FEATURES[2].icon} />
            <h3 className="mt-4 text-base font-semibold text-white">{FEATURES[2].label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#737373]">{FEATURES[2].body}</p>
            {FEATURES[2].illustration}
          </motion.div>

          {/* Feature 4 — normal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
            className="group relative rounded-2xl bg-black p-7 transition-colors duration-300 hover:bg-[#090909]"
          >
            <SpectrumTopEdge />
            <IconBadge icon={FEATURES[3].icon} />
            <h3 className="mt-4 text-base font-semibold text-white">{FEATURES[3].label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#737373]">{FEATURES[3].body}</p>
            {FEATURES[3].illustration}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpectrumTopEdge() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: "var(--zl-spectrum-line)" }}
    />
  );
}

function IconBadge({ icon: Icon }: { icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141414] text-white/40 transition-all duration-300 group-hover:border-white/[0.14] group-hover:text-white/70">
      <Icon size={16} />
    </div>
  );
}
