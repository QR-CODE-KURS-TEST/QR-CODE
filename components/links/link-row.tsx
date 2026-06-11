"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScanLine, Pencil, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/qr/copy-button";
import { toggleLinkActive, updateLinkDestination } from "@/lib/actions/links";

export function LinkRow({
  id,
  qrName,
  shortUrl,
  destinationUrl,
  isActive,
  scanCount,
  lastScanLabel,
}: {
  id: string;
  qrName: string | null;
  shortUrl: string;
  destinationUrl: string;
  isActive: boolean;
  scanCount: number;
  lastScanLabel: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [dest, setDest] = useState(destinationUrl);

  function handleToggle(active: boolean) {
    startTransition(async () => {
      const res = await toggleLinkActive(id, active);
      if (res.error) toast.error(res.error);
      else toast.success(active ? "Link aktiviert." : "Link pausiert.");
      router.refresh();
    });
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updateLinkDestination(id, dest);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Ziel aktualisiert.");
      setEditOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="truncate font-medium">
              {qrName ?? "Ohne Namen"}
            </span>
            {!isActive && <Badge variant="secondary">Pausiert</Badge>}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <code className="truncate text-primary">{shortUrl}</code>
            <CopyButton value={shortUrl} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="shrink-0">→</span>
            <a
              href={destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-1 hover:text-foreground"
            >
              <span className="truncate">{destinationUrl}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <div className="text-center">
            <div className="flex items-center gap-1 text-lg font-semibold tabular-nums">
              <ScanLine className="size-4 text-muted-foreground" />
              {scanCount}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {lastScanLabel}
            </div>
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" size="icon-sm" aria-label="Ziel bearbeiten">
                  <Pencil className="size-4" />
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ziel-URL ändern</DialogTitle>
                <DialogDescription>
                  Die QR-Grafik bleibt unverändert – nur das Weiterleitungsziel
                  wird angepasst. Bereits gedruckte Codes zeigen danach auf das
                  neue Ziel.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-1.5">
                <Label htmlFor={`dest-${id}`}>Neues Ziel</Label>
                <Input
                  id={`dest-${id}`}
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Abbrechen</Button>} />
                <Button onClick={handleSave} disabled={pending}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  Speichern
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Switch
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={pending}
            aria-label="Link aktiv"
          />
        </div>
      </CardContent>
    </Card>
  );
}
