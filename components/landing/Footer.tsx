"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const MENU_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Who it’s for", href: "#who-its-for" },
  { label: "Pricing", href: "/pricing" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer
      id="about"
      className="zl-footer-viewport relative box-border flex flex-col overflow-hidden bg-black scroll-mt-20 md:scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 18% 96%, color-mix(in srgb, var(--zl-spectrum-from) 14%, transparent) 0%, transparent 58%), radial-gradient(ellipse 60% 45% at 85% 12%, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-center overflow-x-hidden overflow-y-auto overscroll-y-contain px-6 pb-3 pt-14 md:px-8 md:pb-4 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease }}
          className="min-h-0"
        >
          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#737373] md:mb-4">
            Zephr
          </p>
          <h2 className="zl-footer-headline max-w-[min(100%,44rem)] font-sans text-[clamp(2.35rem,min(10.5vw,14vh),6.75rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-white">
            <span className="block">
              Scale compliance{" "}
              <span className="zl-text-spectrum">with Zephr.</span>
            </span>
            <span className="mt-3 block max-w-[min(100%,40rem)] text-[clamp(1.35rem,min(4.8vw,6.5vh),2.5rem)] font-medium tracking-[-0.038em] text-white/90">
              Start today.
            </span>
          </h2>
          <p className="zl-footer-lead mt-5 max-w-xl text-[0.9375rem] leading-snug text-[#a1a1a1] md:mt-6 md:text-base md:leading-relaxed">
            One dashboard for FAA, EASA, Transport Canada, and ANAC. Data
            synced every 24 hours and audit-ready.
          </p>

          <div className="zl-footer-cta-row mt-8 flex flex-wrap items-center gap-3 md:mt-9 md:gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:gap-3 md:px-6 md:py-3.5"
            >
              Try for free
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white transition-transform duration-200 group-hover:translate-x-0.5 md:h-8 md:w-8">
                →
              </span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-3 text-sm font-medium text-[#e5e5e5] backdrop-blur-sm transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.08] hover:text-white md:px-6 md:py-3.5"
            >
              View plans
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full shrink-0 border-t border-white/[0.06]">
          <div className="zl-footer-bottom-inner mx-auto max-w-6xl px-6 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:px-8 md:py-9 md:pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div className="zl-footer-columns flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-sm shrink-0 lg:max-w-[min(100%,280px)]">
              <p className="text-sm font-semibold text-white">Zephr</p>
              <p className="mt-3 text-sm leading-snug text-[#737373] md:mt-4 md:leading-relaxed">
                Airworthiness directives in one place. Less friction, more
                traceability.
              </p>
              <a
                href="mailto:contact@zephr.com"
                className="zl-link-subtle mt-4 inline-block text-sm text-[#a1a1a1] transition-colors hover:text-white md:mt-5"
              >
                contact@zephr.com
              </a>
            </div>

            <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-x-14 sm:gap-y-8 md:gap-x-16 lg:gap-x-20">
              <div className="text-left sm:text-right">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#737373] md:mb-4">
                  Menu
                </p>
                <ul className="space-y-2.5 sm:text-right md:space-y-3">
                  {MENU_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="zl-link-subtle zl-link-subtle-end text-sm text-[#a1a1a1] transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left sm:text-right">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#737373] md:mb-4">
                  Legal
                </p>
                <ul className="space-y-2.5 sm:text-right md:space-y-3">
                  {LEGAL_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="zl-link-subtle zl-link-subtle-end text-sm text-[#a1a1a1] transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left sm:text-right">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#737373] md:mb-4">
                  Social
                </p>
                <ul className="space-y-2.5 sm:text-right md:space-y-3">
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.label} className="flex justify-end sm:block">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="zl-link-subtle zl-link-subtle-end inline-flex items-center gap-1.5 text-sm text-[#a1a1a1] transition-colors hover:text-white"
                      >
                        {link.label}
                        <span className="text-[10px] opacity-45">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="zl-footer-meta mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 md:mt-9 md:flex-row md:items-center md:pt-7">
            <p className="text-[0.8125rem] text-[#525252]">
              © {new Date().getFullYear()} Zephr. All rights reserved.
            </p>
            <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[0.6875rem] font-medium tracking-wide text-[#737373]">
              Aviation compliance platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
