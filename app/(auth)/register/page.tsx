"use client";

import { type FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

function getSupabase(ref: React.RefObject<SupabaseClient | null>) {
  if (!ref.current) ref.current = createClient();
  return ref.current;
}

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-white placeholder:text-[var(--text-2)] focus:border-white/25 focus:outline-none";

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
          <h1 className="text-2xl font-semibold text-white">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-[var(--text-2)]">
            Enviamos un enlace de confirmación a <strong className="text-white">{email}</strong>.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-white underline-offset-2 hover:underline">Volver al inicio de sesión</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/" className="fixed left-4 top-4 z-10 text-lg font-semibold tracking-tight text-white hover:text-[var(--text-2)]">Zephr</Link>
      <div className="mx-auto w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-white">Crear cuenta</h1>
          <p className="text-sm text-[var(--text-2)]">Busca ADs de aviación en segundos.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          <input type="password" placeholder="Contraseña (mín. 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputClass} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-white/90 disabled:opacity-50">
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-2)]">
          ¿Ya tienes cuenta? <Link href="/login" className="text-white underline-offset-2 hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </>
  );
}
