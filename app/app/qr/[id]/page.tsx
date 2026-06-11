import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Activity, ArrowUpRight, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrPreview } from "@/components/qr-editor/qr-preview";
import { QrExportPanel } from "@/components/qr/qr-export-panel";
import { DeleteQrButton } from "@/components/qr/delete-qr-button";
import { CopyButton } from "@/components/qr/copy-button";
import type { QRDesign } from "@/lib/qr/types";
import type { PlanTier } from "@/lib/constants";

export const metadata: Metadata = { title: "QR-Code" };

type LinkRow = { slug: string; destination_url: string; is_active: boolean };

export default async function QrDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data: qr } = await supabase
    .from("qr_codes")
    .select(
      "id, name, type, design, target_url, created_at, links(slug, destination_url, is_active)",
    )
    .eq("id", id)
    .single();

  if (!qr) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", (await supabase.auth.getUser()).data.user!.id)
    .single();
  const plan = (profile?.plan ?? "free") as PlanTier;

  const link = (
    Array.isArray(qr.links) ? qr.links[0] : qr.links
  ) as LinkRow | null;

  const isTracked = qr.type === "tracked";
  const shortUrl = isTracked && link ? `${siteUrl}/r/${link.slug}` : null;
  const destinationUrl = isTracked ? link?.destination_url : qr.target_url;
  const encodedData = isTracked ? shortUrl! : (qr.target_url ?? "");
  const design = qr.design as QRDesign;
  const filename = qr.name.replace(/[^a-z0-9äöü]+/gi, "-").toLowerCase() || "qr-code";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/app/qr" />}>
          <ArrowLeft className="size-4" />
          Alle QR-Codes
        </Button>
        <DeleteQrButton id={qr.id} name={qr.name} />
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Vorschau */}
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center rounded-xl bg-muted/40 py-6">
              <QrPreview data={encodedData} design={design} size={220} />
            </CardContent>
          </Card>
        </div>

        {/* Details + Export */}
        <div className="grid gap-6">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{qr.name}</h1>
              <Badge variant={isTracked ? "default" : "secondary"} className="gap-1">
                {isTracked ? (
                  <Activity className="size-3" />
                ) : (
                  <ArrowUpRight className="size-3" />
                )}
                {isTracked ? "Getrackt" : "Direkt"}
              </Badge>
            </div>

            {shortUrl && (
              <div className="mt-3 grid gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Getrackter Kurzlink
                </span>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                  <code className="flex-1 truncate text-sm">{shortUrl}</code>
                  <CopyButton value={shortUrl} />
                </div>
              </div>
            )}

            <div className="mt-3 grid gap-1.5">
              <span className="text-xs text-muted-foreground">Ziel-URL</span>
              <a
                href={destinationUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <span className="truncate">{destinationUrl}</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exportieren</CardTitle>
            </CardHeader>
            <CardContent>
              <QrExportPanel
                data={encodedData}
                design={design}
                filename={filename}
                plan={plan}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
