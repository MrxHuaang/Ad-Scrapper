"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    description: "Explore AD compliance tracking with no commitment.",
    cta: "Get Started",
    href: "/register",
    featured: false,
    features: [
      { label: "50 AD searches / month", included: true },
      { label: "FAA & EASA only", included: true },
      { label: "Basic filters", included: true },
      { label: "5 PDF exports / month", included: true },
      { label: "Saved searches", included: false },
      { label: "Compliance alerts", included: false },
      { label: "All 6 authorities", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthly: 29,
    annual: 24,
    description: "For individual professionals managing active fleets.",
    cta: "Start Free Trial",
    href: "/login",
    featured: true,
    badge: "Most popular",
    features: [
      { label: "Unlimited searches", included: true },
      { label: "All 4 authorities (FAA, EASA, TC, ANAC)", included: true },
      { label: "Advanced filters & saved searches", included: true },
      { label: "Unlimited PDF exports", included: true },
      { label: "10 compliance alert subscriptions", included: true },
      { label: "Priority email support", included: true },
      { label: "Team members", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 99,
    annual: 82,
    description: "For maintenance departments and multi-aircraft operators.",
    cta: "Contact Sales",
    href: "mailto:contact@zephr.com",
    featured: false,
    features: [
      { label: "Everything in Professional", included: true },
      { label: "All 6 authorities incl. ANAC ARG & DGAC", included: true },
      { label: "Up to 10 team members", included: true },
      { label: "Shared saved searches", included: true },
      { label: "Audit trail & activity logs", included: true },
      { label: "Unlimited compliance alerts", included: true },
      { label: "API access", included: true },
      { label: "Dedicated support", included: true },
    ],
  },
] as const;

function PriceDisplay({ monthly, annual, isAnnual }: { monthly: number; annual: number; isAnnual: boolean }) {
  const price = isAnnual ? annual : monthly;
  if (price === 0) return (
    <div className="mt-6 flex items-end gap-1">
      <span className="text-4xl font-semibold text-white">Free</span>
    </div>
  );
  return (
    <div className="mt-6 flex items-end gap-1">
      <span className="text-lg font-medium text-white/40">$</span>
      <span className="text-4xl font-semibold tabular-nums text-white">{price}</span>
      <span className="mb-1 text-sm text-white/30">/mo</span>
    </div>
  );
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(232,184,75,0.15), transparent)" }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            Pricing
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-sm text-white/35">
            Start free. Upgrade when your operation demands it.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                !isAnnual ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/60"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                isAnnual ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/60"
              }`}
            >
              Annual
              <span className="rounded-full bg-[#e8b84b]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#e8b84b]">
                −17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              className={`relative flex flex-col bg-black p-7 ${
                plan.featured ? "ring-1 ring-inset ring-[#e8b84b]/20" : ""
              }`}
            >
              {/* Featured spectrum edge */}
              {plan.featured && (
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, #e8b84b, transparent)" }}
                />
              )}

              {/* Badge */}
              {plan.featured && (
                <span className="mb-3 inline-flex w-fit rounded-full border border-[#e8b84b]/25 bg-[#e8b84b]/10 px-2.5 py-1 text-[11px] font-semibold text-[#e8b84b]">
                  Most popular
                </span>
              )}

              <p className="text-base font-semibold text-white">{plan.name}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/35">{plan.description}</p>

              <PriceDisplay monthly={plan.monthly} annual={plan.annual} isAnnual={isAnnual} />

              {isAnnual && plan.monthly > 0 && (
                <p className="mt-1 text-[11px] text-white/25">
                  Billed ${plan.annual * 12}/year
                </p>
              )}

              {/* CTA */}
              <Link
                href={plan.href}
                className={`mt-6 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/[0.1] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="my-6 h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check size={14} className="mt-0.5 shrink-0 text-[#e8b84b]" />
                    ) : (
                      <Minus size={14} className="mt-0.5 shrink-0 text-white/15" />
                    )}
                    <span className={`text-[13px] leading-snug ${f.included ? "text-white/60" : "text-white/20"}`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mt-px flex flex-col items-center justify-between gap-4 bg-white/[0.02] px-7 py-5 sm:flex-row"
        >
          <div>
            <p className="text-sm font-semibold text-white">Enterprise</p>
            <p className="mt-0.5 text-[13px] text-white/35">
              Unlimited seats, SSO, SLA, custom integrations, dedicated support.
            </p>
          </div>
          <a
            href="mailto:contact@zephr.com"
            className="shrink-0 rounded-xl border border-white/[0.1] bg-transparent px-5 py-2.5 text-sm font-semibold text-white/60 transition-all hover:border-white/[0.2] hover:text-white"
          >
            Talk to us →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
