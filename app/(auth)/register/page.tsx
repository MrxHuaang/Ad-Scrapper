"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { ZephrLogo } from "@/components/icons/ZephrLogo";

export default function RegisterPage() {
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  if (confirmEmail) {
    return (
      <>
        <Link
          href="/"
          className="fixed left-6 top-5 z-10 inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] transition-colors hover:text-white"
        >
          <span className="text-base leading-none">‹</span> Home
        </Link>
        <div className="mx-auto w-full max-w-[min(100%,30rem)] text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/5 backdrop-blur-xl">
              <ZephrLogo width={28} height={28} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#737373]">
            We sent a confirmation link to{" "}
            <span className="font-medium text-[#a1a1a1]">{confirmEmail}</span>.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block text-sm font-medium text-white underline-offset-2 hover:underline"
          >
            Back to log in
          </Link>
        </div>
      </>
    );
  }

  return <AuthForm mode="register" onRegisterSuccess={setConfirmEmail} />;
}
