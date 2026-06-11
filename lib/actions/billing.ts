"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { PLANS, type BillingInterval } from "@/lib/stripe/plans";

async function getOrigin() {
  const h = await headers();
  return (
    h.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

export async function startCheckout(
  tier: "pro" | "business",
  interval: BillingInterval,
) {
  const plan = PLANS.find((p) => p.tier === tier);
  const priceId = plan?.priceIds[interval];
  if (!priceId) {
    redirect("/app/settings/billing?error=price_missing");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? profile?.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const base = await getOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${base}/app/settings/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/app/settings/billing?canceled=1`,
    subscription_data: { metadata: { user_id: user.id } },
    metadata: { user_id: user.id },
  });

  if (session.url) redirect(session.url);
  redirect("/app/settings/billing?error=checkout");
}

export async function openCustomerPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_customer_id) {
    redirect("/app/settings/billing");
  }

  const base = await getOrigin();
  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${base}/app/settings/billing`,
  });
  redirect(portal.url);
}
