import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = { title: "Regulators" };

export default function RegulatorsPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-dvh items-center justify-center bg-[var(--zl-bg)] px-6">
        <div className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--zl-text-3)]">
            Coming soon
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,6vw,5rem)] italic text-[var(--zl-text)]">
            Regulators
          </h1>
          <p className="mt-4 text-[var(--zl-text-2)]">
            Authority coverage details are on their way.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--zl-gold)] transition-opacity hover:opacity-75"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
