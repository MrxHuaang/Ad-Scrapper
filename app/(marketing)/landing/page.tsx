import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zephr — Airworthiness Directives",
};

export default function LandingPage() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <h1 className="text-4xl font-semibold tracking-tight">Landing</h1>
    </section>
  );
}
