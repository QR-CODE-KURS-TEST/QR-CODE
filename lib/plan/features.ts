import type { PlanTier } from "@/lib/constants";

export interface PlanDisplay {
  tier: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
}

export const PLAN_DISPLAY: PlanDisplay[] = [
  {
    tier: "free",
    name: "Free",
    tagline: "Zum Ausprobieren",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "3 getrackte QR-Codes",
      "Unbegrenzt direkte QR-Codes",
      "PNG-Export",
      "7 Tage Scan-Statistik",
      "Basis-Design (Farben + Logo)",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    tagline: "Für Creator & Profis",
    priceMonthly: 12,
    priceYearly: 99,
    highlighted: true,
    features: [
      "50 getrackte QR-Codes",
      "Voll-Design: Logo, Verläufe, Frames",
      "PNG, SVG & PDF (300 DPI Druck)",
      "Unbegrenzte Scan-Historie",
      "CSV-Export",
      'Kein „Made with"-Branding',
    ],
  },
  {
    tier: "business",
    name: "Business",
    tagline: "Für Teams & Agenturen",
    priceMonthly: 39,
    priceYearly: 349,
    features: [
      "Unbegrenzte getrackte QR-Codes",
      "Alles aus Pro",
      "Eigene Kurz-Domain",
      "Geo- & Geräte-Analytics",
      "API-Zugang",
      "Priority-Support",
    ],
  },
];
