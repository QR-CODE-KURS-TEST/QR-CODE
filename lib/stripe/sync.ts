import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "./server";
import { tierFromPriceId } from "./plans";

const ACTIVE_STATES = new Set(["active", "trialing", "past_due"]);

function getPeriodEnd(sub: Stripe.Subscription): string | null {
  // Je nach Stripe-API-Version liegt das Periodenende am Sub oder am Item.
  const raw =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    sub.items?.data?.[0]?.current_period_end;
  return raw ? new Date(raw * 1000).toISOString() : null;
}

/** Schreibt ein Stripe-Abo in profiles.plan + subscriptions (via Service-Role). */
export async function upsertSubscriptionRecord(sub: Stripe.Subscription) {
  const admin = createAdminClient();
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price.id ?? null;
  const tier = tierFromPriceId(priceId);

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (!profile) return;

  const plan = ACTIVE_STATES.has(sub.status) ? tier : "free";

  await admin.from("profiles").update({ plan }).eq("id", profile.id);

  await admin.from("subscriptions").upsert(
    {
      user_id: profile.id,
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      status: sub.status,
      plan,
      current_period_end: getPeriodEnd(sub),
      cancel_at_period_end: sub.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );
}

/** Synchronisiert direkt nach Checkout (Fallback, falls Webhook noch fehlt). */
export async function syncFromCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });
  if (session.subscription && typeof session.subscription !== "string") {
    await upsertSubscriptionRecord(session.subscription);
  }
}
