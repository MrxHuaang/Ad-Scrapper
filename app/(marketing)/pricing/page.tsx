"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    description: "Get started with AD compliance tracking.",
    cta: "Get Started",
    ctaHref: "/login",
    featured: false,
    features: [
      "Up to 50 AD searches / month",
      "FAA & EASA coverage",
      "Basic filters",
      "PDF export (5 / month)",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: { monthly: "$29", annual: "$24" },
    description: "For maintenance professionals and small ops.",
    cta: "Start Free Trial",
    ctaHref: "/login",
    featured: true,
    features: [
      "Unlimited searches",
      "All 4 authorities (FAA, EASA, TC, ANAC)",
      "Advanced filters & saved searches",
      "Unlimited PDF exports",
      "Compliance alerts",
      "Priority email support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: { monthly: "$99", annual: "$82" },
    description: "For teams managing multi-aircraft fleets.",
    cta: "Contact Sales",
    ctaHref: "mailto:contact@zephr.com",
    featured: false,
    features: [
      "Everything in Professional",
      "Up to 10 team members",
      "Shared saved searches",
      "Audit trail & activity logs",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      router.push("/login");
      return;
    }

    if (planId === "team" && PLANS.find(p => p.id === "team")?.cta === "Contact Sales") {
      window.location.href = "mailto:contact@zephr.com";
      return;
    }

    try {
      setLoading(planId);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login?returnTo=/pricing");
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Could not initiate checkout", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-black pt-20">
        {/* Header */}
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 text-center lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
            Pricing
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[#a1a1a1]">
            Start free. Scale as your fleet grows. No hidden fees.
          </p>

          {/* Billing toggle hint */}
          <p className="mt-3 text-xs text-[#737373]">
            Annual billing saves up to{" "}
            <span className="text-white">20%</span>
          </p>
        </div>

        {/* Plans grid */}
        <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-200 ${
                  plan.featured
                    ? "border-white/30 bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,255,255,0.04)]"
                    : "border-white/[0.1] bg-[#0a0a0a] hover:border-white/[0.2]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-white px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-black">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="mb-1 text-sm font-semibold text-white">
                    {plan.name}
                  </p>
                  <p className="text-xs text-[#737373]">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">
                    {plan.price.monthly}
                  </span>
                  <span className="ml-1 text-sm text-[#737373]">/mo</span>
                  {plan.price.annual !== plan.price.monthly && (
                    <p className="mt-1 text-xs text-[#737373]">
                      {plan.price.annual}/mo billed annually
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading !== null}
                  className={`mb-8 w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.featured
                      ? "bg-white text-black hover:bg-[#e5e5e5]"
                      : "border border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {loading === plan.id ? "Connecting..." : plan.cta}
                </button>

                <div className="border-t border-white/[0.06] pt-6">
                  <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                    What&apos;s included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-[#a1a1a1]">
                          ✓
                        </span>
                        <span className="text-sm text-[#a1a1a1]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise callout */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] px-8 py-6 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-white">
                Enterprise / MRO
              </p>
              <p className="text-sm text-[#737373]">
                Custom contracts, SLAs, and on-premise options for large
                organizations.
              </p>
            </div>
            <a
              href="mailto:contact@zephr.com"
              className="shrink-0 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
            >
              Contact us
            </a>
          </div>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
