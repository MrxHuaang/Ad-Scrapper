"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Who it’s for", href: "#who-its-for" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-6 px-6 lg:px-8 transition-colors duration-500 pointer-events-none`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between relative pointer-events-auto">

          {/* Left: Brand */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              {/* Logomark: compliance arc + checkmark */}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* 270° arc, gap at lower-right — radar / compliance loop */}
                <path
                  d="M 18.36 5.64 A 9 9 0 1 0 5.64 18.36"
                  stroke="#e8b84b"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                {/* Checkmark inside */}
                <path
                  d="M 8 12 L 11 15 L 16 9"
                  stroke="#e8b84b"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[1.125rem] font-semibold tracking-[-0.01em] text-white">
                Zephr
              </span>
            </Link>
          </div>

          {/* Center: Floating Pill Navbar (Absolute Centered) */}
          <nav
            className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border transition-all duration-500 md:flex ${
              scrolled
                ? "border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl p-1"
                : "border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-1.5"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#a1a1a1] transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {/* Solid Black Button embedded inside the pill */}
            <Link
              href="/login"
              className="ml-2 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all hover:bg-black"
            >
              Sign in
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="h-3 w-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-xl"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[4.5px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`block h-px w-4 bg-white transition-all duration-300 ${
                      mobileOpen
                        ? i === 0
                          ? "translate-y-[5.5px] rotate-45"
                          : i === 1
                            ? "opacity-0"
                            : "-translate-y-[5.5px] -rotate-45"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-medium text-[#a1a1a1] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-8 flex items-center gap-3 rounded-full bg-white px-8 py-3 text-base font-semibold text-black"
          >
            Log in
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-3.5 w-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
