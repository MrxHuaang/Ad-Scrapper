import Link from "next/link";
import Prism from "@/components/landing/Prism";

export default function NotFound() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Prism
          height={3.2}
          baseWidth={5.6}
          animationType="hover"
          transparent
          glow={1}
          bloom={1}
          noise={0.45}
          timeScale={0.35}
          colorSaturation={0.55}
          offset={{ x: 0.1, y: -0.1 }}
          suspendWhenOffscreen={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 35%, rgba(232,184,75,0.10), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.85))",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            404
            <span className="h-1 w-1 rounded-full bg-white/25" />
            Page not found
          </div>

          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-white">
            This page doesn’t exist.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/45">
            The link may be outdated, or the page was moved. You can go back to the dashboard or the
            landing page.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
            >
              Go to dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-black/40 px-5 py-3 text-sm font-semibold text-white/75 backdrop-blur-xl transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Go to landing
            </Link>
          </div>

          <div className="mt-6 text-[11px] text-white/30">
            Tip: If you typed the URL manually, check the spelling.
          </div>
        </div>
      </div>
    </div>
  );
}

