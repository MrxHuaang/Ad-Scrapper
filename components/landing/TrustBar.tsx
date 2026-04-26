"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { value: "28,000+", label: "Directives indexed" },
  { value: "6", label: "Regulatory authorities" },
  { value: "24 h", label: "Update cycle" },
  { value: "100%", label: "Official source links" },
];

const ROLES = [
  "A&P Mechanics",
  "Maintenance Directors",
  "Quality Assurance",
  "Airworthiness Consultants",
  "MRO Operators",
  "Fleet Managers",
];

export function TrustBar() {
  return (
    <section className="border-b border-white/[0.05] bg-black py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center gap-10"
        >
          {/* Heading */}
          <div className="text-center">
            <p className="text-[0.8125rem] font-medium text-white/25 tracking-[0.1em] uppercase">
              Trusted by aviation professionals across
            </p>
            {/* Role pills */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {ROLES.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-white/35"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full max-w-md bg-white/[0.05]" />

          {/* Stats grid */}
          <div className="grid w-full grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className="flex flex-col items-center gap-1 bg-black px-4 py-6 text-center"
              >
                <span className="font-mono text-2xl font-semibold tabular-nums text-white/80">
                  {s.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/25">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
