"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const QUESTIONS = [
  {
    q: "Where does the AD data come from?",
    a: "All directives are scraped directly from official authority portals: FAA (Federal Register & DRS), EASA AD portal, Transport Canada TCCA, ANAC Brasil, ANAC Argentina, and DGAC Chile. Every record includes a direct link to the official source document.",
  },
  {
    q: "How often is the database updated?",
    a: "Our scrapers run automatically every 24 hours against each authority portal. New or amended directives published during the day are typically available in Zephr within 24 hours of official publication.",
  },
  {
    q: "Is the free plan really free — no credit card required?",
    a: "Yes. The free plan is completely free with no credit card required. You get 50 searches per month covering FAA and EASA, enough to evaluate whether Zephr fits your workflow.",
  },
  {
    q: "Can I export ADs as PDF for my maintenance records?",
    a: "The Professional and Team plans include unlimited PDF exports. Each export includes the full AD text, metadata, and a direct link to the official authority document for audit traceability.",
  },
  {
    q: "How do compliance alerts work?",
    a: "You subscribe to aircraft makes and models. When a new AD is published or an existing one is amended that matches your subscribed types, you receive an immediate email notification. Professional accounts support 10 fleet type subscriptions; Team accounts are unlimited.",
  },
  {
    q: "Do you cover ICAO, CASA Australia, or GCAA?",
    a: "CASA Australia and GCAA UAE are on our roadmap. Current coverage: FAA, EASA, Transport Canada, ANAC Brasil, ANAC Argentina, and DGAC Chile. Enterprise customers can request priority integration of additional authorities.",
  },
  {
    q: "Is Zephr a replacement for official authority portals?",
    a: "No — Zephr is a search and monitoring layer on top of official sources. Every directive links back to its official publication. Always verify compliance against the original authority document. Zephr does not replace qualified airworthiness review.",
  },
  {
    q: "Can multiple technicians share one account?",
    a: "The Team plan supports up to 10 seats with shared saved searches and a unified audit log. For larger organizations or unlimited seats, contact us about an Enterprise plan.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-6 py-5 text-left"
      >
        <span className="text-[15px] font-medium text-white/80">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-0.5 shrink-0 text-white/30"
        >
          <Plus size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
          >
            <p className="pb-5 text-[14px] leading-relaxed text-white/40">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            FAQ
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {QUESTIONS.map((item) => (
            <Item key={item.q} q={item.q} a={item.a} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mt-10 text-center text-sm text-white/25"
        >
          Still have questions?{" "}
          <a href="mailto:contact@zephr.com" className="text-white/45 underline underline-offset-4 hover:text-white/70 transition-colors">
            Email us
          </a>
        </motion.p>
      </div>
    </section>
  );
}
