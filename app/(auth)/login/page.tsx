"use client";

import { type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

function getSupabase(ref: React.RefObject<SupabaseClient | null>) {
  if (!ref.current) ref.current = createClient();
  return ref.current;
}

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-[#555] transition-colors focus:border-white/20 focus:bg-[#141414] focus:outline-none focus:ring-0";

const oauthBtnCls =
  "flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0d0d0d] py-3 text-sm font-medium text-[#d4d4d4] transition-colors hover:border-white/[0.15] hover:bg-[#141414] hover:text-white";

const primaryBtnCls =
  "mt-2 w-full cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all duration-200 disabled:border disabled:border-white/[0.04] disabled:bg-white/[0.02] disabled:text-[#444] disabled:shadow-none bg-white text-black hover:bg-[#e5e5e5] shadow-[0_2px_24px_rgba(255,255,255,0.1),0_0_48px_-20px_var(--zl-spectrum-glow)]";

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60"
          style={{ animationDelay: `${i * 120}ms`, animationDuration: "700ms" }}
        />
      ))}
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const sbRef = useRef<SupabaseClient | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<null | "google">(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await getSupabase(sbRef).auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/search");
  }

  async function handleGoogle() {
    if (oauthLoading) return;
    setOauthLoading("google");
    await getSupabase(sbRef).auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <>
      {/* Back link */}
      <Link
        href="/"
        className="fixed left-6 top-5 z-10 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-[#a1a1a1] backdrop-blur-sm transition-all hover:border-white/[0.2] hover:bg-white/[0.09] hover:text-white"
      >
        <span className="text-base leading-none">‹</span> Home
      </Link>

      {/* Card */}
      <div className="mx-auto w-full max-w-[380px]">
        {/* Logo mark */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#141414] text-base font-bold text-white">
            Z
          </div>
        </div>

        <h1 className="mb-1.5 text-center text-[1.35rem] font-semibold tracking-tight text-white">
          Log in to Zephr
        </h1>
        <p className="mb-8 text-center text-sm text-[#737373]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-white underline-offset-2 hover:underline"
          >
            Sign up.
          </Link>
        </p>

        {/* OAuth buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            className={oauthBtnCls}
            disabled={oauthLoading === "google"}
          >
            {oauthLoading === "google" ? (
              <>
                <LoadingDots />
                <span className="text-white/80">Loading</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                Log in with Google
              </>
            )}
          </button>
          <button
            type="button"
            className={oauthBtnCls}
            disabled
          >
            {/* GitHub icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.01-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Log in with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-[#737373]">or</span>
          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#a1a1a1]">
              Email
            </label>
            <input
              type="email"
              placeholder="alan.turing@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-[#a1a1a1]">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-semibold text-white hover:text-[#3B82F6] transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#737373] hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPw ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={primaryBtnCls}
          >
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        {/* Terms */}
        <p className="mt-6 text-center text-[0.6875rem] text-[#737373]">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-[#a1a1a1] underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#a1a1a1] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
