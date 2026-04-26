"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ZephrLogo } from "@/components/icons/ZephrLogo";
import { LandingSectionLink } from "@/components/landing/LandingSectionLink";

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
              <ZephrLogo width={28} height={28} />
              <span className="text-[1.125rem] font-semibold tracking-[-0.01em] text-white">
                Zephr
              </span>
            </Link>
          </div>

          {/* Center: Floating Pill Navbar (Absolute Centered) */}
          <nav
            className={`absolute left-1/2 top-1/2 hidden max-w-[calc(100vw-10rem)] -translate-x-1/2 -translate-y-1/2 flex-nowrap items-center justify-center gap-0.5 rounded-full border transition-all duration-500 md:flex ${
              scrolled
                ? "border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl p-1"
                : "border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-1.5"
            }`}
          >
            <LandingSectionLink
              sectionId="product"
              className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#a1a1a1] transition-all duration-300 hover:bg-white/[0.05] hover:text-white md:px-3 md:py-2 md:text-sm"
            >
              Product
            </LandingSectionLink>
            <LandingSectionLink
              sectionId="features"
              className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#a1a1a1] transition-all duration-300 hover:bg-white/[0.05] hover:text-white md:px-3 md:py-2 md:text-sm"
            >
              Features
            </LandingSectionLink>
            <Link
              href="/pricing"
              className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#a1a1a1] transition-all duration-300 hover:bg-white/[0.05] hover:text-white md:px-3 md:py-2 md:text-sm"
            >
              Pricing
            </Link>

            <div className="mx-0.5 h-4 w-px shrink-0 self-center bg-white/10" />

            <Link
              href="/login"
              className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#a1a1a1] transition-all duration-300 hover:bg-white/[0.05] hover:text-white md:px-3 md:py-2 md:text-sm"
            >
              Log in
            </Link>

            {/* Solid White Button for registration */}
            <Link
              href="/register"
              className="ml-0.5 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white py-1.5 pl-2.5 pr-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90 md:gap-2 md:pl-3 md:pr-2 md:py-2 md:text-sm"
            >
              Sign up
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
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
          <LandingSectionLink
            sectionId="product"
            onAfterNavigate={() => setMobileOpen(false)}
            className="text-2xl font-medium text-[#a1a1a1] transition-colors hover:text-white"
          >
            Product
          </LandingSectionLink>
          <LandingSectionLink
            sectionId="features"
            onAfterNavigate={() => setMobileOpen(false)}
            className="text-2xl font-medium text-[#a1a1a1] transition-colors hover:text-white"
          >
            Features
          </LandingSectionLink>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-medium text-[#a1a1a1] transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <div className="flex flex-col gap-4 w-full max-w-[280px]">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 py-4 text-lg font-medium text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-3 rounded-full bg-white py-4 text-lg font-semibold text-black"
            >
              Sign up
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
      </div>
    </>
  );
}
