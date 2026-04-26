"use client";

import { type FormEvent, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { ZephrLogo } from "@/components/icons/ZephrLogo";
import {
  getLastOauthProvider,
  subscribeLastOauth,
  type OauthProviderId,
} from "@/lib/auth/last-oauth-provider";

function getSupabase(ref: React.RefObject<SupabaseClient | null>) {
  if (!ref.current) ref.current = createClient();
  return ref.current;
}

/* Resend-like: glass surfaces that pick up the soft prism behind */
const glassSurface =
  "border border-white/[0.12] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl";

const inputCls = [
  "w-full rounded-xl px-4 py-3.5 text-[0.9375rem] leading-snug text-white/95 transition-[color,box-shadow,background] duration-200 sm:px-5 sm:py-4",
  "placeholder:text-white/35",
  glassSurface,
  "hover:bg-white/[0.05] focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.06)] focus:outline-none focus:ring-0",
].join(" ");

const oauthBtnCls = [
  "relative flex w-full min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-3.5 text-sm font-medium sm:min-h-[52px] sm:px-3 sm:py-4",
  "text-white/80 transition-[color,transform,box-shadow,background] duration-200",
  glassSurface,
  "hover:border-white/18 hover:bg-white/[0.08] hover:text-white",
  "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70",
].join(" ");

const primaryBase =
  "mt-2 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 sm:py-4 sm:text-[0.9375rem]";

const primaryDisabled = [
  "cursor-not-allowed",
  glassSurface,
  "border-white/[0.08] text-white/32 shadow-none",
  "hover:bg-white/[0.04]",
].join(" ");

const primaryEnabled = [
  "cursor-pointer",
  "border border-white/25 bg-white text-zinc-950",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.12)]",
  "hover:-translate-y-px hover:bg-white/95 active:scale-[0.99]",
].join(" ");

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

function GitHubIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.01-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

type AuthFormProps = {
  mode: "login" | "register";
  /** After successful sign-up request (check email to confirm) */
  onRegisterSuccess?: (email: string) => void;
};

export function AuthForm({ mode, onRegisterSuccess }: AuthFormProps) {
  const router = useRouter();
  const sbRef = useRef<SupabaseClient | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OauthProviderId | null>(null);
  const lastUsed = useSyncExternalStore(
    subscribeLastOauth,
    getLastOauthProvider,
    () => null
  );

  const emailOk = email.trim().length > 0 && /^\S+@\S+\.\S+/.test(email.trim());
  const passwordOk =
    mode === "register"
      ? password.length >= 8
      : password.length > 0;
  const formComplete = emailOk && passwordOk;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formComplete) return;
    setError("");
    setLoading(true);
    if (mode === "login") {
      const { error: err } = await getSupabase(sbRef).auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push("/search");
      return;
    }
    const { error: err } = await getSupabase(sbRef).auth.signUp({
      email: email.trim(),
      password,
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    onRegisterSuccess?.(email.trim());
  }

  async function startOAuth(provider: OauthProviderId) {
    if (oauthLoading) return;
    // Do not set "last used" here — it would flash during the redirect.
    // The cookie is set in /auth/callback only after OAuth succeeds.
    setOauthLoading(provider);
    const { error: err } = await getSupabase(sbRef).auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (err) {
      setError(err.message);
      setOauthLoading(null);
    }
  }

  const oauthLabel = mode === "login" ? "Log in" : "Sign up";

  return (
    <>
      <Link
        href="/"
        className="fixed left-6 top-5 z-10 inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] transition-colors hover:text-white"
      >
        <span className="text-base leading-none">‹</span> Home
      </Link>

      <div className="mx-auto w-full max-w-[min(100%,30rem)]">
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${glassSurface} ring-1 ring-white/5`}
          >
            <ZephrLogo width={28} height={28} />
          </div>
        </div>

        <h1 className="text-center text-2xl font-semibold tracking-tight text-white">
          {mode === "login" ? "Log in to Zephr" : "Create a Zephr account"}
        </h1>
        <p className="mb-8 mt-1.5 text-center text-sm text-[#737373]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-white hover:underline">
                Sign up
              </Link>
              .
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-white hover:underline">
                Log in
              </Link>
              .
            </>
          )}
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-3.5">
          <div className="relative">
            {lastUsed === "google" && (
              <span className="absolute -left-0.5 -top-2 z-10 rounded-md border border-white/[0.12] bg-black/25 px-1.5 py-0.5 text-[0.65rem] font-medium leading-none text-white/50 backdrop-blur-md">
                Last used
              </span>
            )}
            <button
              type="button"
              onClick={() => startOAuth("google")}
              className={oauthBtnCls}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "google" ? (
                <>
                  <LoadingDots />
                  <span className="text-white/80">Loading</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="truncate">
                    {oauthLabel} with Google
                  </span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            {lastUsed === "github" && (
              <span className="absolute -left-0.5 -top-2 z-10 rounded-md border border-white/[0.12] bg-black/25 px-1.5 py-0.5 text-[0.65rem] font-medium leading-none text-white/50 backdrop-blur-md">
                Last used
              </span>
            )}
            <button
              type="button"
              onClick={() => startOAuth("github")}
              className={oauthBtnCls}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "github" ? (
                <>
                  <LoadingDots />
                  <span className="text-white/80">Loading</span>
                </>
              ) : (
                <>
                  <GitHubIcon />
                  <span className="truncate">
                    {oauthLabel} with GitHub
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-xs text-white/30">or</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#737373]">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="alan.turing@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            {mode === "login" ? (
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-xs font-medium text-[#737373]">Password</label>
                <Link
                  href="#"
                  className="shrink-0 text-xs font-medium text-white/90 hover:text-white"
                >
                  Forgot your password?
                </Link>
              </div>
            ) : (
              <label className="mb-1.5 block text-xs font-medium text-[#737373]">
                Password
              </label>
            )}
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] transition-colors hover:text-white"
                aria-label="Toggle password visibility"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
            <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300/90 backdrop-blur-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!formComplete || loading}
            className={`${primaryBase} ${
              !formComplete || loading ? primaryDisabled : primaryEnabled
            }`}
          >
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.6875rem] leading-relaxed text-[#525252]">
          By {mode === "login" ? "signing in" : "signing up"}, you agree to our{" "}
          <Link href="#" className="text-[#737373] underline-offset-2 hover:underline">
            Terms
          </Link>
          ,{" "}
          <Link href="#" className="text-[#737373] underline-offset-2 hover:underline">
            Acceptable Use
          </Link>
          , and{" "}
          <Link href="#" className="text-[#737373] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
