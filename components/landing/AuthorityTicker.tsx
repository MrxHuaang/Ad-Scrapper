"use client";

import { motion } from "framer-motion";

const ITEMS = [
  { code: "FAA", name: "Federal Aviation Administration", region: "United States", count: "10,000+" },
  { code: "EASA", name: "EU Aviation Safety Agency", region: "Europe", count: "8,000+" },
  { code: "TC", name: "Transport Canada Civil Aviation", region: "Canada", count: "3,000+" },
  { code: "ANAC", name: "Agência Nacional de Aviação Civil", region: "Brazil", count: "450+" },
  { code: "ARG", name: "ANAC Argentina", region: "Argentina", count: "—" },
  { code: "DGAC", name: "DGAC Chile", region: "Chile", count: "—" },
];

// doubled for seamless loop
const DOUBLED = [...ITEMS, ...ITEMS];

function Separator() {
  return (
    <span className="mx-6 inline-block h-4 w-px bg-white/10 align-middle" aria-hidden="true" />
  );
}

export function AuthorityTicker() {
  return (
    <div
      className="relative overflow-hidden border-y border-white/[0.06] bg-black/40 py-3"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {DOUBLED.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 whitespace-nowrap">
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#e8b84b]">
              {item.code}
            </span>
            <span className="text-[11px] text-white/30">{item.name}</span>
            {item.count !== "—" && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] tabular-nums text-white/20">
                {item.count}
              </span>
            )}
            <Separator />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
