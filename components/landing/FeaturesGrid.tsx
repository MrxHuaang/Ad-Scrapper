"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Search, Bell, FileCheck, RefreshCw } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Illustrations ── */
function SearchIllustration() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-[11px]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-white/20">
        <Search size={11} />
        <span className="text-white/30">boeing 737 rudder</span>
        <span className="ml-auto rounded bg-[#e8b84b]/10 px-1.5 py-0.5 text-[10px] text-[#e8b84b]">214 results</span>
      </div>
      {[
        { code: "2024-09-12", auth: "FAA", title: "Boeing 737 — Rudder System" },
        { code: "2024-07-03", auth: "EASA", title: "B737 Rudder Travel Limiter" },
        { code: "2023-11-28", auth: "TC", title: "737 Rudder Control System" },
        { code: "2023-05-14", auth: "ANAC", title: "737 Flight Control Surfaces" },
      ].map((r) => (
        <div key={r.code} className="flex items-center gap-3 border-b border-white/[0.04] py-2 last:border-0">
          <span className="w-20 shrink-0 text-white/20">{r.code}</span>
          <span className="w-10 rounded px-1 text-[9px] font-semibold text-[#e8b84b]">{r.auth}</span>
          <span className="truncate text-white/35">{r.title}</span>
        </div>
      ))}
    </div>
  );
}

function AlertIllustration() {
  return (
    <div className="space-y-2">
      {[
        { label: "Boeing 737", active: true },
        { label: "Airbus A320", active: true },
        { label: "Cessna 172", active: false },
        { label: "Embraer 175", active: true },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="text-[13px] text-white/40">{item.label}</span>
          <div className="flex items-center gap-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: item.active ? "#e8b84b" : "rgba(255,255,255,0.12)" }}
              animate={item.active ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] text-white/20">{item.active ? "watching" : "off"}</span>
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-[#e8b84b]/20 bg-[#e8b84b]/[0.05] px-4 py-3 mt-3">
        <p className="text-[11px] font-semibold text-[#e8b84b]">↑ New AD: FAA-2024-09-12</p>
        <p className="mt-0.5 text-[11px] text-white/30">Boeing 737 — matches your fleet</p>
      </div>
    </div>
  );
}

function AuditIllustration() {
  return (
    <div className="space-y-3">
      {[
        { ts: "09:14", action: "AD FAA-2024-09-12 reviewed", color: "#e8b84b" },
        { ts: "09:02", action: "Export PDF generated", color: "rgba(255,255,255,0.25)" },
        { ts: "Yesterday", action: "EASA AD saved to fleet record", color: "rgba(255,255,255,0.25)" },
        { ts: "2 days ago", action: "TC AD compliance verified", color: "rgba(255,255,255,0.25)" },
      ].map((ev) => (
        <div key={ev.action} className="flex items-start gap-3">
          <div className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ev.color }} />
          <div className="flex-1">
            <p className="text-[12px] leading-snug text-white/40">{ev.action}</p>
            <p className="text-[10px] text-white/20 mt-0.5">{ev.ts}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SyncIllustration() {
  return (
    <div className="space-y-3">
      {[
        { auth: "FAA", time: "2h ago" },
        { auth: "EASA", time: "2h ago" },
        { auth: "TC", time: "3h ago" },
        { auth: "ANAC", time: "4h ago" },
      ].map((s) => (
        <div key={s.auth} className="flex items-center gap-3">
          <span className="w-12 font-mono text-[11px] font-bold tracking-widest text-white/20">{s.auth}</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-white/25">{s.time}</span>
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-[#00d47f]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: Math.random() * 1 }}
          />
        </div>
      ))}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#00d47f]/15 bg-[#00d47f]/[0.04] px-4 py-2.5">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <RefreshCw size={12} className="text-[#00d47f]/60" />
        </motion.div>
        <span className="text-[11px] text-white/30">Next sync in <span className="text-white/50">22 hours</span></span>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    num: "01",
    icon: Search,
    label: "Instant full-text search",
    body: "Query 28,000+ ADs across all authorities in milliseconds. Filter by aircraft type, effective date, or regulation number.",
    stat: "28,431 ADs indexed",
    illustration: <SearchIllustration />,
  },
  {
    num: "02",
    icon: Bell,
    label: "Automatic compliance alerts",
    body: "Subscribe to aircraft types and get notified the moment a new AD is published or amended — before it affects your fleet.",
    stat: "Real-time notifications",
    illustration: <AlertIllustration />,
  },
  {
    num: "03",
    icon: FileCheck,
    label: "Complete audit traceability",
    body: "Every record links back to the official authority source. Export to PDF for maintenance logs and audit documentation.",
    stat: "Official source links",
    illustration: <AuditIllustration />,
  },
  {
    num: "04",
    icon: RefreshCw,
    label: "Daily synchronization",
    body: "Scrapers run every 24 hours against official portals. FAA, EASA, Transport Canada, and ANAC — always current.",
    stat: "Every 24 hours",
    illustration: <SyncIllustration />,
  },
] as const;

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // More scroll per panel = slower horizontal movement
  const SCROLL_PER_PANEL = 900;
  const EXTRA_SCROLL = SCROLL_PER_PANEL * (FEATURES.length - 1);

  useGSAP(() => {
    const strip = stripRef.current;
    const section = sectionRef.current;
    if (!strip || !section) return;

    // x in pixels — correct approach for a flex strip (xPercent is relative to strip's
    // own width which is 4× viewport, making percentages misleading)
    const scrollTween = gsap.to(strip, {
      x: () => -(FEATURES.length - 1) * window.innerWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Panels 1-3: content slides in from right
    gsap.utils.toArray<HTMLElement>(".feature-panel").forEach((panel, i) => {
      if (i === 0) return;
      const content = panel.querySelector(".panel-content");
      const visual = panel.querySelector(".panel-visual");
      if (!content) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          containerAnimation: scrollTween,
          trigger: panel,
          start: "left right",
          toggleActions: "play none none none",
        },
      });
      tl.from(content, { opacity: 0, x: 40, duration: 0.65, ease: "power3.out" });
      if (visual) tl.from(visual, { opacity: 0, x: 24, duration: 0.55, ease: "power2.out" }, "-=0.4");
    });
  });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-transparent"
      style={{ height: `calc(100dvh + ${EXTRA_SCROLL}px)` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-dvh overflow-hidden">

        {/* Top fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-28"
          style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }}
          aria-hidden
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32"
          style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }}
          aria-hidden
        />

        {/* Labels */}
        <div className="pointer-events-none absolute left-6 top-8 z-20 lg:left-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3f3f]">
            Platform Capabilities
          </p>
        </div>
        <div className="pointer-events-none absolute right-6 top-8 z-20 font-mono text-[11px] text-white/15 lg:right-12">
          01 <span className="mx-1 opacity-40">—</span> {String(FEATURES.length).padStart(2, "0")}
        </div>

        {/* Horizontal strip */}
        <div
          ref={stripRef}
          className="flex h-full will-change-transform"
          style={{ width: `${FEATURES.length * 100}vw` }}
        >
          {FEATURES.map((feature, i) => (
            <div
              key={feature.num}
              className="feature-panel relative flex h-full shrink-0 flex-col justify-center"
              style={{ width: "100vw" }}
            >
              {/* Dark overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.84) 35%, rgba(0,0,0,0.88) 100%)",
                }}
              />

              {/* Side glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: i % 2 === 0
                    ? "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(232,184,75,0.03) 0%, transparent 60%)"
                    : "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)",
                }}
              />

              <div className="relative mx-auto flex h-full w-full max-w-7xl items-center gap-16 px-10 lg:px-16">
                {/* Left — content */}
                <div className="panel-content flex w-full flex-col lg:w-1/2">
                  <span className="mb-8 font-mono text-xs font-bold tracking-[0.3em] text-white/10">
                    {feature.num} / {String(FEATURES.length).padStart(2, "0")}
                  </span>

                  <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.01em] text-white">
                    {feature.label.split(" ").map((word, wi) => (
                      <span key={wi} className="mr-[0.2em] inline-block">
                        {word}
                      </span>
                    ))}
                  </h2>

                  <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-[#737373]">
                    {feature.body}
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#e8b84b]/50" />
                    <span className="font-mono text-xs text-[#e8b84b]/60">{feature.stat}</span>
                  </div>
                </div>

                {/* Right — illustration */}
                <div className="panel-visual hidden w-1/2 lg:block">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
                    {feature.illustration}
                  </div>
                </div>
              </div>

              {/* Bottom border */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
