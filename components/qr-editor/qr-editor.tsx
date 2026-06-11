"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity, ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { QrPreview } from "./qr-preview";
import { DesignControls } from "./design-controls";
import { DEFAULT_DESIGN, type QRDesign } from "@/lib/qr/types";
import { createQrCode } from "@/lib/actions/qr";

type Mode = "tracked" | "direct";

export function QrEditor({ siteUrl }: { siteUrl: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("tracked");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [design, setDesign] = useState<QRDesign>(DEFAULT_DESIGN);

  const patchDesign = (patch: Partial<QRDesign>) =>
    setDesign((d) => ({ ...d, ...patch }));

  const previewData =
    mode === "tracked"
      ? `${siteUrl}/r/vorschau`
      : destinationUrl || "https://scanvio.app";

  function handleCreate() {
    if (!destinationUrl.trim()) {
      toast.error("Bitte gib das Ziel deines QR-Codes ein.");
      return;
    }
    startTransition(async () => {
      const res = await createQrCode({ name, mode, destinationUrl, design });
      if ("error" in res) {
        toast.error(res.error, {
          action: res.limitReached
            ? {
                label: "Upgraden",
                onClick: () => router.push("/app/settings/billing"),
              }
            : undefined,
        });
        return;
      }
      toast.success("QR-Code erstellt!");
      router.push(`/app/qr/${res.id}`);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Steuerung */}
      <div className="order-2 grid gap-6 lg:order-1">
        <Card className="p-5">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="qr-name">Name (intern)</Label>
              <Input
                id="qr-name"
                placeholder="z. B. Speisekarte Tisch 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Typ</Label>
              <div className="grid grid-cols-2 gap-2">
                <ModeCard
                  active={mode === "tracked"}
                  onClick={() => setMode("tracked")}
                  icon={<Activity className="size-4" />}
                  title="Getrackt"
                  desc="Über unseren Link – mit Scan-Statistik."
                />
                <ModeCard
                  active={mode === "direct"}
                  onClick={() => setMode("direct")}
                  icon={<ArrowUpRight className="size-4" />}
                  title="Direkt"
                  desc="Direkt zur URL – ohne Tracking."
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="qr-dest">Ziel-URL</Label>
              <Input
                id="qr-dest"
                placeholder="https://deine-website.de"
                inputMode="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
              />
              {mode === "tracked" && (
                <p className="text-xs text-muted-foreground">
                  Der finale getrackte Kurzlink wird beim Erstellen generiert.
                  Die QR-Grafik bleibt danach unveränderlich.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <DesignControls design={design} onChange={patchDesign} />
        </Card>
      </div>

      {/* Vorschau (sticky) */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-20">
          <Card className="grid gap-4 p-5">
            <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-muted/40 p-4">
              <QrPreview data={previewData} design={design} size={240} />
            </div>
            <Button size="lg" onClick={handleCreate} disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Wird erstellt…
                </>
              ) : (
                "QR-Code erstellen"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Export (PNG, PDF, SVG) auf der nächsten Seite.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid gap-1 rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-primary bg-accent"
          : "hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {title}
      </span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </button>
  );
}
