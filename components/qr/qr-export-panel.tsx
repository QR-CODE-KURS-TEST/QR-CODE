"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Lock, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  downloadPng,
  downloadSvg,
  downloadPdf,
  PDF_FORMATS,
  type PdfFormatKey,
} from "@/lib/qr/export";
import { canUseFormat, type ExportFormat } from "@/lib/plan/limits";
import type { PlanTier } from "@/lib/constants";
import type { QRDesign } from "@/lib/qr/types";

const PNG_SIZES = [
  { value: "512", label: "512 px – Web" },
  { value: "1024", label: "1024 px – Standard" },
  { value: "2048", label: "2048 px – Hi-Res" },
];

export function QrExportPanel({
  data,
  design,
  filename,
  plan,
}: {
  data: string;
  design: QRDesign;
  filename: string;
  plan: PlanTier;
}) {
  const router = useRouter();
  const [pngSize, setPngSize] = useState("1024");
  const [pdfFormat, setPdfFormat] = useState<PdfFormatKey>("a4");
  const [busy, setBusy] = useState<string | null>(null);

  function gate(format: ExportFormat): boolean {
    if (canUseFormat(plan, format)) return true;
    toast.error("Dieses Exportformat ist im Pro-Plan enthalten.", {
      action: {
        label: "Upgraden",
        onClick: () => router.push("/app/settings/billing"),
      },
    });
    return false;
  }

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try {
      await fn();
    } catch {
      toast.error("Export fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setBusy(null);
    }
  }

  const locked = (f: ExportFormat) => !canUseFormat(plan, f);

  return (
    <div className="grid gap-5">
      {/* PNG */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">PNG</span>
        </div>
        <div className="flex gap-2">
          <Select value={pngSize} onValueChange={(v) => v && setPngSize(v)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PNG_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              run("png", () =>
                downloadPng(data, design, Number(pngSize), filename),
              )
            }
            disabled={busy !== null}
          >
            {busy === "png" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download
          </Button>
        </div>
      </div>

      {/* PDF */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">PDF (Druck, 300 DPI)</span>
          {locked("pdf") && <ProBadge />}
        </div>
        <div className="flex gap-2">
          <Select
            value={pdfFormat}
            onValueChange={(v) => v && setPdfFormat(v as PdfFormatKey)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PDF_FORMATS) as PdfFormatKey[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {PDF_FORMATS[k].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={locked("pdf") ? "outline" : "default"}
            onClick={() => {
              if (!gate("pdf")) return;
              run("pdf", () => downloadPdf(data, design, pdfFormat, filename));
            }}
            disabled={busy !== null}
          >
            {busy === "pdf" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : locked("pdf") ? (
              <Lock className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            Download
          </Button>
        </div>
      </div>

      {/* SVG */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">SVG (Vektor)</span>
          {locked("svg") && <ProBadge />}
        </div>
        <Button
          variant={locked("svg") ? "outline" : "default"}
          className="w-full"
          onClick={() => {
            if (!gate("svg")) return;
            run("svg", () => downloadSvg(data, design, filename));
          }}
          disabled={busy !== null}
        >
          {busy === "svg" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : locked("svg") ? (
            <Lock className="size-4" />
          ) : (
            <Download className="size-4" />
          )}
          SVG herunterladen
        </Button>
      </div>
    </div>
  );
}

function ProBadge() {
  return (
    <Badge variant="secondary" className="gap-1">
      <Lock className="size-3" />
      Pro
    </Badge>
  );
}
