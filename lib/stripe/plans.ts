import type { PlanTier } from "@/lib/constants";

export type BillingInterval = "monthly" | "yearly";

export interface PlanConfig {
  tier: Exclude<PlanTier, "free">;
  name: string;
  priceMonthly: number; // EUR
  priceYearly: number; // EUR (Jahrespreis)
  priceIds: Record<BillingInterval, string | undefined>;
}

/** Zentrale Pricing-Definition. Preis-IDs kommen aus den Env-Variablen. */
export const PLANS: PlanConfig[] = [
  {
    tier: "pro",
    name: "Pro",
    priceMonthly: 12,
    priceYearly: 99,
    priceIds: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
  },
  {
    tier: "business",
    name: "Business",
    priceMonthly: 39,
    priceYearly: 349,
    priceIds: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
    },
  },
];

/** Findet anhand einer Stripe-Price-ID den zugehörigen Plan-Tier. */
export function tierFromPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return "free";
  for (const plan of PLANS) {
    if (
      plan.priceIds.monthly === priceId ||
      plan.priceIds.yearly === priceId
    ) {
      return plan.tier;
    }
  }
  return "free";
}

/** Prüft, ob eine Price-ID zu unseren konfigurierten Preisen gehört. */
export function isKnownPriceId(priceId: string): boolean {
  return tierFromPriceId(priceId) !== "free";
}
