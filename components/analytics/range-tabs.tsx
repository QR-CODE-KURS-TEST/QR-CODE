"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanTier } from "@/lib/constants";

const RANGES = [
  { value: 7, label: "7 Tage" },
  { value: 30, label: "30 Tage" },
  { value: 90, label: "90 Tage" },
];

export function RangeTabs({
  current,
  plan,
}: {
  current: number;
  plan: PlanTier;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function select(value: number) {
    if (plan === "free" && value > 7) {
      toast.error("Längere Zeiträume sind im Pro-Plan enthalten.", {
        action: {
          label: "Upgraden",
          onClick: () => router.push("/app/settings/billing"),
        },
      });
      return;
    }
    const next = new URLSearchParams(params);
    next.set("range", String(value));
    router.push(`/app/analytics?${next.toString()}`);
  }

  return (
    <div className="inline-flex rounded-lg border bg-card p-0.5">
      {RANGES.map((r) => {
        const locked = plan === "free" && r.value > 7;
        const active = current === r.value;
        return (
          <button
            key={r.value}
            onClick={() => select(r.value)}
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r.label}
            {locked && <Lock className="size-3" />}
          </button>
        );
      })}
    </div>
  );
}
