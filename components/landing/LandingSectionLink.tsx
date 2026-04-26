"use client";

import { usePathname } from "next/navigation";

type LandingSectionLinkProps = {
  sectionId: string;
  className?: string;
  children: React.ReactNode;
  /** e.g. close mobile menu after navigation */
  onAfterNavigate?: () => void;
};

/**
 * Hash-only section links. Avoids `next/link` + hash quirks (e.g. `/#a#b`) and
 * uses a single `/#section` in the address bar on the home page.
 */
export function LandingSectionLink({
  sectionId,
  className,
  children,
  onAfterNavigate,
}: LandingSectionLinkProps) {
  const pathname = usePathname();
  const href = `/#${sectionId}`;

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onAfterNavigate?.();
        if (pathname === "/") {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          window.history.replaceState(null, "", href);
        } else {
          window.location.assign(`${window.location.origin}/#${sectionId}`);
        }
      }}
    >
      {children}
    </a>
  );
}
