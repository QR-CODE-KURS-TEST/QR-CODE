import type { PlanTier } from "@/lib/constants";

export type ExportFormat = "png" | "svg" | "pdf";

export interface PlanLimits {
  trackedQrs: number; // max. Anzahl getrackter QR-Codes (Infinity = unbegrenzt)
  formats: ExportFormat[];
  analyticsDays: number; // Infinity = unbegrenzt
  removeBranding: boolean;
  customDomain: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    trackedQrs: 3,
    formats: ["png"],
    analyticsDays: 7,
    removeBranding: false,
    customDomain: false,
  },
  pro: {
    trackedQrs: 50,
    formats: ["png", "svg", "pdf"],
    analyticsDays: Infinity,
    removeBranding: true,
    customDomain: false,
  },
  business: {
    trackedQrs: Infinity,
    formats: ["png", "svg", "pdf"],
    analyticsDays: Infinity,
    removeBranding: true,
    customDomain: true,
  },
};

export function canCreateTrackedQr(plan: PlanTier, currentCount: number) {
  return currentCount < PLAN_LIMITS[plan].trackedQrs;
}

export function canUseFormat(plan: PlanTier, format: ExportFormat) {
  return PLAN_LIMITS[plan].formats.includes(format);
}
