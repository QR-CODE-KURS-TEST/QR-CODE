"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_DISPLAY, type PlanDisplay } from "@/lib/plan/features";
import type { BillingInterval } from "@/lib/stripe/plans";
import type { PlanTier } from "@/lib/constants";
import { startCheckout } from "@/lib/actions/billing";

export function PricingTable({
  mode = "signup",
  currentPlan,
}: {
  /** "signup": CTAs führen zur Registrierung. "checkout": echter Stripe-Checkout. */
  mode?: "signup" | "checkout";
  currentPlan?: PlanTier;
}) {
  const [interval, setBillingInterval] = useState<BillingInterval>("yearly");
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function checkout(tier: "pro" | "business") {
    setPendingTier(tier);
    startTransition(async () => {
      await startCheckout(tier, interval);
      setPendingTier(null);
    });
  }

  return (
    <div className="grid gap-6">
      <div className="mx-auto inline-flex items-center gap-1 rounded-full border bg-card p-1">
        <ToggleBtn
          active={interval === "monthly"}
          onClick={() => setBillingInterval("monthly")}
        >
          Monatlich
        </ToggleBtn>
        <ToggleBtn
          active={interval === "yearly"}
          onClick={() => setBillingInterval("yearly")}
        >
          Jährlich
          <Badge variant="secondary" className="ml-1.5">
            2 Monate gratis
          </Badge>
        </ToggleBtn>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {PLAN_DISPLAY.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            interval={interval}
            mode={mode}
            currentPlan={currentPlan}
            pendingTier={pendingTier}
            onCheckout={checkout}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  interval,
  mode,
  currentPlan,
  pendingTier,
  onCheckout,
}: {
  plan: PlanDisplay;
  interval: BillingInterval;
  mode: "signup" | "checkout";
  currentPlan?: PlanTier;
  pendingTier: string | null;
  onCheckout: (tier: "pro" | "business") => void;
}) {
  const price = interval === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const suffix =
    plan.tier === "free" ? "" : interval === "yearly" ? "/Jahr" : "/Monat";
  const isCurrent = mode === "checkout" && currentPlan === plan.tier;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6",
        plan.highlighted && "border-primary shadow-lg shadow-primary/10",
      )}
    >
      {plan.highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
          <Sparkles className="size-3" />
          Beliebtester
        </Badge>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
      </div>

      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight">{price} €</span>
        <span className="text-sm text-muted-foreground">{suffix}</span>
      </div>

      <div className="mb-6">
        <PlanCta
          plan={plan}
          mode={mode}
          isCurrent={isCurrent}
          currentPlan={currentPlan}
          pendingTier={pendingTier}
          onCheckout={onCheckout}
        />
      </div>

      <ul className="grid gap-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanCta({
  plan,
  mode,
  isCurrent,
  currentPlan,
  pendingTier,
  onCheckout,
}: {
  plan: PlanDisplay;
  mode: "signup" | "checkout";
  isCurrent: boolean;
  currentPlan?: PlanTier;
  pendingTier: string | null;
  onCheckout: (tier: "pro" | "business") => void;
}) {
  if (mode === "signup") {
    return (
      <Button
        className="w-full"
        variant={plan.highlighted ? "default" : "outline"}
        render={<Link href="/signup" />}
      >
        {plan.tier === "free" ? "Kostenlos starten" : `${plan.name} wählen`}
      </Button>
    );
  }

  if (plan.tier === "free") {
    return (
      <Button className="w-full" variant="outline" disabled>
        {currentPlan === "free" ? "Aktueller Plan" : "Im Free enthalten"}
      </Button>
    );
  }

  if (isCurrent) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Aktiver Plan
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      variant={plan.highlighted ? "default" : "outline"}
      disabled={pendingTier !== null}
      onClick={() => onCheckout(plan.tier as "pro" | "business")}
    >
      {pendingTier === plan.tier && <Loader2 className="size-4 animate-spin" />}
      {plan.name} wählen
    </Button>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
