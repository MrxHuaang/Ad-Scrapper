"use client";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const AUTHORITIES = [
  { code: "FAA", name: "Federal Aviation Administration", region: "United States", count: "10,000+" },
  { code: "EASA", name: "EU Aviation Safety Agency", region: "Europe", count: "8,000+" },
  { code: "TC", name: "Transport Canada Civil Aviation", region: "Canada", count: "3,000+" },
  { code: "ANAC", name: "Agência Nacional de Aviação Civil", region: "Brazil", count: "450+" },
];

export function AuthorityCoverage() {
  return (
    <section id="regulators" className="relative py-24 md:py-32">
      {/* Warm gold glow — bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 100% 100%, color-mix(in srgb, var(--zl-spectrum-from) 6%, transparent) 0%, color-mix(in srgb, var(--zl-spectrum-to) 8%, transparent) 45%, transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-4"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            Authority Coverage
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Global regulatory data,
            <br />
            updated every 24h
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-14 flex items-center gap-3"
        >
          <span className="text-3xl font-bold text-white">21,450+</span>
          <span className="text-sm text-[#737373]">directives indexed</span>
        </motion.div>

        {/* Divider then table */}
        <div className="border-t border-white/[0.08]">
          {AUTHORITIES.map((auth, i) => (
            <motion.div
              key={auth.code}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
              className="group flex items-center gap-6 border-b border-white/[0.06] py-5 transition-colors duration-200 hover:bg-[#0a0a0a]"
            >
              <span className="w-14 shrink-0 font-mono text-xs font-bold tracking-widest text-[#52525B]">
                {auth.code}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-white">{auth.name}</p>
                <p className="text-xs text-[#737373]">{auth.region}</p>
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-[#a1a1a1]">
                {auth.count}
              </span>
            </motion.div>
          ))}
          <div className="flex items-center gap-6 py-5 text-sm text-[#737373]">
            <span className="w-14 font-mono text-xs">→</span>
            <span>More authorities in progress</span>
          </div>
        </div>
      </div>
    </section>
  );
}
