import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 501 });
  }

  try {
    const { planId } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let priceId = "";
    if (planId === "professional") {
      priceId = process.env.STRIPE_PRO_PRICE_ID || "";
    } else if (planId === "team") {
      priceId = process.env.STRIPE_TEAM_PRICE_ID || "";
    }

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or price not configured" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[STRIPE_CHECKOUT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
