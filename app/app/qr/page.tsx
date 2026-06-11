import Link from "next/link";
import type { Metadata } from "next";
import { Plus, QrCode, Activity, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrPreview } from "@/components/qr-editor/qr-preview";
import type { QRDesign } from "@/lib/qr/types";

export const metadata: Metadata = { title: "QR-Codes" };

type LinkRow = { slug: string };

export default async function QrListPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data: codes } = await supabase
    .from("qr_codes")
    .select("id, name, type, design, target_url, created_at, links(slug)")
    .order("created_at", { ascending: false });

  const items = codes ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="QR-Codes"
        description="Erstelle, designe und exportiere deine QR-Codes."
        action={
          <Button render={<Link href="/app/qr/new" />}>
            <Plus className="size-4" />
            Neuer QR-Code
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <QrCode className="size-7" />
            </div>
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold">Noch keine QR-Codes</h2>
              <p className="text-sm text-muted-foreground">
                Erstelle deinen ersten Code – in unter einer Minute.
              </p>
            </div>
            <Button render={<Link href="/app/qr/new" />}>
              <Plus className="size-4" />
              QR-Code erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((qr) => {
            const isTracked = qr.type === "tracked";
            const link = (
              Array.isArray(qr.links) ? qr.links[0] : qr.links
            ) as LinkRow | null;
            const encoded =
              isTracked && link
                ? `${siteUrl}/r/${link.slug}`
                : (qr.target_url ?? "");
            return (
              <Link key={qr.id} href={`/app/qr/${qr.id}`}>
                <Card className="group h-full transition-colors hover:border-primary/40">
                  <CardContent className="flex flex-col items-center gap-3 p-4">
                    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted/40 p-3">
                      <QrPreview
                        data={encoded}
                        design={qr.design as QRDesign}
                        size={120}
                      />
                    </div>
                    <div className="w-full">
                      <div className="truncate text-sm font-medium">
                        {qr.name}
                      </div>
                      <Badge
                        variant={isTracked ? "default" : "secondary"}
                        className="mt-1 gap-1"
                      >
                        {isTracked ? (
                          <Activity className="size-3" />
                        ) : (
                          <ArrowUpRight className="size-3" />
                        )}
                        {isTracked ? "Getrackt" : "Direkt"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
