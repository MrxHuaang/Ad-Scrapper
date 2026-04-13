import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
    </section>
  );
}
