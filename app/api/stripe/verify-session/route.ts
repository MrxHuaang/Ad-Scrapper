import { getStripe } from "@/lib/stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  // Verify session belongs to this user
  if (session.metadata?.userId !== user.id) {
    return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
  }

  const planId = session.metadata?.planId;
  if (!planId) {
    return NextResponse.json({ error: "No plan in session" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: planId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[VERIFY_SESSION] Supabase update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ plan: planId });
}
