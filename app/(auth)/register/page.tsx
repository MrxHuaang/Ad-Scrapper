"use client";

import { type FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ZephrLogo } from "@/components/icons/ZephrLogo";

function getSupabase(ref: React.RefObject<SupabaseClient | null>) {
  if (!ref.current) ref.current = createClient();
  return ref.current;
}

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-[#555] transition-colors focus:border-white/20 focus:bg-[#141414] focus:outline-none focus:ring-0";

const primaryBtnCls =
  "mt-2 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 disabled:border disabled:border-white/[0.04] disabled:bg-white/[0.02] disabled:text-[#444] disabled:shadow-none bg-white text-black hover:bg-[#e5e5e5] shadow-[0_2px_24px_rgba(255,255,255,0.1),0_0_48px_-20px_var(--zl-spectrum-glow)]";

export default function RegisterPage() {
  const sbRef = useRef<SupabaseClient | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await getSupabase(sbRef).auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <Link href="/" className="fixed left-4 top-4 z-10 text-lg font-semibold tracking-tight text-white hover:text-[var(--text-2)]">Zephr</Link>
        <div className="mx-auto w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Check your email</h1>
          <p className="mt-2 text-sm text-[var(--text-2)]">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-white underline-offset-2 hover:underline">Back to log in</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/" className="fixed left-6 top-5 z-10 flex items-center gap-1.5 text-xs text-[#737373] transition-colors hover:text-white">
        <span className="text-[10px]">‹</span> Home
      </Link>
      <div className="mx-auto w-full max-w-[380px]">
        {/* Logo mark */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#141414] shadow-[0_0_24px_-8px_var(--zl-spectrum-glow)]">
            <ZephrLogo width={28} height={28} />
          </div>
        </div>
        <div className="mb-8 space-y-1 text-center">
          <h1 className="text-[1.35rem] font-semibold tracking-tight text-white">Create account</h1>
          <p className="text-sm text-[#737373]">Search aviation ADs in seconds.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
          <input type="password" placeholder="Password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputCls} />
          {error && <p className="rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className={primaryBtnCls}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-8 text-center text-[0.6875rem] text-[#737373]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white underline-offset-2 hover:underline">Log in.</Link>
        </p>
      </div>
    </>
  );
}
