"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanTier } from "@/lib/constants";

export function ExportButton({
  plan,
  range,
}: {
  plan: PlanTier;
  range: number;
}) {
  const router = useRouter();

  if (plan !== "free") {
    return (
      <Button
        variant="outline"
        render={<a href={`/app/analytics/export?range=${range}`} />}
      >
        <Download className="size-4" />
        CSV-Export
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.error("Der CSV-Export ist im Pro-Plan enthalten.", {
          action: {
            label: "Upgraden",
            onClick: () => router.push("/app/settings/billing"),
          },
        })
      }
    >
      <Lock className="size-4" />
      CSV-Export
    </Button>
  );
}
