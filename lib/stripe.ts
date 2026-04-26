import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY || "";

if (!secretKey && process.env.NODE_ENV === "production") {
  console.warn("STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.");
}

export function getStripe(): Stripe | null {
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: "2026-03-25.dahlia",
    appInfo: {
      name: "Zephr",
      version: "0.1.0",
    },
  });
}
