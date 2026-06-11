import type { Metadata } from "next";
import { CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/admin";
import { syncFromCheckoutSession } from "@/lib/stripe/sync";
import { openCustomerPortal } from "@/lib/actions/billing";
import { PageHeader } from "@/components/app/page-header";
import { PricingTable } from "@/components/billing/pricing-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_LABELS, type PlanTier } from "@/lib/constants";

export const metadata: Metadata = { title: "Abo & Rechnung" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    session_id?: string;
  }>;
}) {
  const { success, canceled, session_id } = await searchParams;

  // Post-Checkout-Sync (greift auf Vercel auch ohne Webhook, sobald
  // der Service-Role-Key gesetzt ist).
  if (success && session_id && hasServiceRole()) {
    try {
      await syncFromCheckoutSession(session_id);
    } catch (e) {
      console.error("Checkout-Sync fehlgeschlagen:", e);
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", user!.id)
    .single();
  const plan = (profile?.plan ?? "free") as PlanTier;
  const hasCustomer = !!profile?.stripe_customer_id;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, cancel_at_period_end")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Abo & Rechnung"
        description="Wähle den Plan, der zu dir passt. Jederzeit kündbar."
      />

      {success && (
        <Banner
          variant="success"
          icon={<CheckCircle2 className="size-5" />}
          text="Zahlung erfolgreich – willkommen an Bord! Dein Plan wird in Kürze aktiv."
        />
      )}
      {canceled && (
        <Banner
          variant="muted"
          icon={<XCircle className="size-5" />}
          text="Checkout abgebrochen. Kein Problem – du kannst jederzeit upgraden."
        />
      )}

      {/* Aktueller Plan */}
      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Aktueller Plan</span>
                <Badge variant={plan === "free" ? "secondary" : "default"}>
                  {PLAN_LABELS[plan]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {sub?.cancel_at_period_end
                  ? "Läuft zum Periodenende aus."
                  : plan === "free"
                    ? "Upgrade jederzeit möglich."
                    : "Dein Abo ist aktiv."}
              </p>
            </div>
          </div>
          {hasCustomer && (
            <form action={openCustomerPortal}>
              <Button type="submit" variant="outline">
                Abo verwalten
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <PricingTable mode="checkout" currentPlan={plan} />
    </div>
  );
}

function Banner({
  variant,
  icon,
  text,
}: {
  variant: "success" | "muted";
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      className={
        variant === "success"
          ? "mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
          : "mb-6 flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
      }
    >
      <span className={variant === "success" ? "text-primary" : ""}>{icon}</span>
      {text}
    </div>
  );
}
