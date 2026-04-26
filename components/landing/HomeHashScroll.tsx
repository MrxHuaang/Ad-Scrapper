"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function normalizeDoubleHash() {
  const h = window.location.hash;
  if (!h) return;
  if (!h.slice(1).includes("#")) return;
  const first = h.slice(1).split("#")[0];
  if (first) {
    window.history.replaceState(null, "", `/#${first}`);
  }
}

function scrollToHashSection() {
  const raw = window.location.hash.slice(1);
  if (!raw) return;
  if (raw.includes("#")) return;
  const el = document.getElementById(decodeURIComponent(raw));
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * On `/` with `/#id`, scroll to the section. Normalizes a malformed `/#a#b` URL
 * to `/#a`.
 */
export function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    normalizeDoubleHash();
    const t = window.setTimeout(() => scrollToHashSection(), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const onHash = () => {
      normalizeDoubleHash();
      scrollToHashSection();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname]);

  return null;
}
