"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.045] p-8 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[28px] backdrop-saturate-[1.35] md:rounded-3xl md:p-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.11) 0%, transparent 42%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-white/[0.07] blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.article>
  );
}

function NodeGraphic() {
  return (
    <div className="relative mx-auto my-8 flex h-36 max-w-[220px] items-center justify-center md:h-44 md:max-w-[260px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[85%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute h-[70%] w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      </div>
      <div className="relative flex items-center gap-3 md:gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-xl font-light text-white/90 shadow-[0_0_24px_-8px_rgba(255,255,255,0.25)] md:h-16 md:w-16">
          +
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10" />
          <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10" />
        </div>
        <div className="hidden flex-col gap-2 sm:flex">
          <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10" />
          <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10" />
        </div>
      </div>
    </div>
  );
}

export function StickyAudienceSection() {
  return (
    <section
      id="who-its-for"
      className="relative scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 40%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 85% 70%, color-mix(in srgb, var(--zl-spectrum-from) 6%, transparent) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-20">
          <div className="max-w-xl lg:sticky lg:top-24 lg:z-10 lg:self-start xl:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#737373]">
                Who it’s for
              </p>
              <h2 className="font-sans text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                Built for aviation professionals.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#a1a1a1] md:text-[1.05rem]">
                Zephr is for teams that need precision and speed in
                airworthiness and compliance workflows.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease }}
              className="text-[0.95rem] leading-relaxed text-[#d4d4d4] md:text-base lg:pt-1"
            >
              Keep your fleet airworthy, cut downtime, and stay ahead of
              regulators—with a single, proactive workflow.
            </motion.p>

            <GlassCard delay={0.02}>
              <h3 className="text-lg font-semibold text-white md:text-xl">
                Maintenance technicians
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#a3a3a3] md:text-[0.9375rem]">
                Find applicable ADs, amendment history, and official links in
                seconds—less manual search, more time on the aircraft.
              </p>
            </GlassCard>

            <GlassCard delay={0.06}>
              <h3 className="text-lg font-semibold text-white md:text-xl">
                Maintenance directors
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#a3a3a3] md:text-[0.9375rem]">
                One view across FAA, EASA, TC, and ANAC. Prioritize risk,
                delegate with context, and prove compliance in audits.
              </p>
            </GlassCard>

            <GlassCard delay={0.1}>
              <h3 className="text-lg font-semibold text-white md:text-xl">
                Airworthiness consultants
              </h3>
              <NodeGraphic />
              <p className="text-sm leading-relaxed text-[#a3a3a3] md:text-[0.9375rem]">
                Deliver a higher tier of service with consolidated AD access and
                tools to analyze client compliance.
              </p>
            </GlassCard>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.4)] md:rounded-3xl md:p-10"
            >
              <p className="font-sans text-5xl font-semibold tracking-[-0.04em] text-black md:text-6xl">
                +90%
              </p>
              <p className="mt-3 text-sm font-medium text-neutral-600 md:text-base">
                Less time spent searching
              </p>
            </motion.div>

            <GlassCard delay={0.04}>
              <p className="font-sans text-5xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                −60%
              </p>
              <p className="mt-3 text-sm font-medium text-[#a3a3a3] md:text-base">
                Regulatory risk exposure
              </p>
            </GlassCard>

            <GlassCard delay={0.08} className="mb-4">
              <p className="font-sans text-5xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                200K+
              </p>
              <p className="mt-3 text-sm font-medium text-[#a3a3a3] md:text-base">
                Records indexed and updated
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
