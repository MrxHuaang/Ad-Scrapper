import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    console.error("[WEBHOOK] Stripe not configured");
    return new NextResponse("Stripe is not configured", { status: 501 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret) {
    console.error("[WEBHOOK] STRIPE_WEBHOOK_SECRET not set");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  if (!signature) {
    console.error("[WEBHOOK] Missing Stripe-Signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[WEBHOOK] constructEvent failed:", msg);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  console.log("[WEBHOOK] Event received:", event.type, event.id);

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("[WEBHOOK] checkout.session.completed — metadata:", session.metadata);

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId) {
      console.error("[WEBHOOK] Missing userId in metadata");
      return new NextResponse("Missing userId in metadata", { status: 400 });
    }

    if (!planId) {
      console.error("[WEBHOOK] Missing planId in metadata");
      return new NextResponse("Missing planId in metadata", { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: planId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      })
      .eq("id", userId);

    if (error) {
      console.error("[WEBHOOK] Supabase update failed:", error);
      return new NextResponse("Database update failed", { status: 500 });
    }

    console.log("[WEBHOOK] Plan updated to", planId, "for user", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    console.log("[WEBHOOK] subscription.deleted:", subscription.id);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: "free",
        stripe_subscription_id: null,
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      console.error("[WEBHOOK] Supabase downgrade failed:", error);
      return new NextResponse("Database update failed", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
