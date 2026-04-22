import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY || "";

// We don't throw during build time if the key is missing to allow the static generation pass
// but we will warn in development or log it.
if (!secretKey && process.env.NODE_ENV === "production") {
  console.warn("STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.");
}

export const stripe = new Stripe(secretKey, {
  // @ts-ignore
  apiVersion: "2025-01-27-acacia",
  appInfo: {
    name: "Zephr",
    version: "0.1.0",
  },
});
