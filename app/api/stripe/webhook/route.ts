import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  const obj = event.data.object;

  if (event.type === "checkout.session.completed") {
    const session = obj as Stripe.Checkout.Session;

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        plan: session.metadata.planId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      })
      .eq("id", session.metadata.userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = obj as Stripe.Subscription;

    await supabaseAdmin
      .from("profiles")
      .update({
        plan: "free",
        stripe_subscription_id: null,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse(null, { status: 200 });
}
