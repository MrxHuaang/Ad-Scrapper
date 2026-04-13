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

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-white placeholder:text-[var(--text-2)] focus:border-white/25 focus:outline-none";

export default function LoginPage() {
  const router = useRouter();
  const sbRef = useRef<SupabaseClient | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await getSupabase(sbRef).auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push("/search");
  }

  async function handleGoogle() {
    await getSupabase(sbRef).auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <>
      <Link href="/" className="fixed left-4 top-4 z-10 text-lg font-semibold tracking-tight text-white hover:text-[var(--text-2)]">Zephr</Link>
      <div className="mx-auto w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-white">Bienvenido de nuevo</h1>
          <p className="text-sm text-[var(--text-2)]">Inicia sesión en tu cuenta.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-white/90 disabled:opacity-50">
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-[var(--text-2)]">
          <span className="h-px flex-1 bg-[var(--border)]" />o<span className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-3 text-[var(--text-2)] hover:border-white/20 hover:text-[var(--text-1)]">
          <GoogleIcon />
          Continuar con Google
        </button>
        <p className="mt-6 text-center text-sm text-[var(--text-2)]">
          ¿No tienes cuenta? <Link href="/register" className="text-white underline-offset-2 hover:underline">Registrarse</Link>
        </p>
      </div>
    </>
  );
}
