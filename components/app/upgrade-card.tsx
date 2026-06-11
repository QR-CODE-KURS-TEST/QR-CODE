import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpgradeCard() {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="size-4 text-primary" />
        Upgrade auf Pro
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        50 Tracking-Codes, volles Design, PDF-Export &amp; unbegrenzte
        Analytics.
      </p>
      <Button
        size="sm"
        className="w-full"
        render={<Link href="/app/settings/billing" />}
      >
        Jetzt upgraden
      </Button>
    </div>
  );
}
