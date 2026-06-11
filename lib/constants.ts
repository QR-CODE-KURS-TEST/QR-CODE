/** Arbeitstitel der App – an einer Stelle änderbar. */
export const APP_NAME = "Scanvio";
export const APP_TAGLINE = "QR-Codes, die verkaufen.";

export type PlanTier = "free" | "pro" | "business";

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};
