import Link from "next/link";
import type { Metadata } from "next";
import { Link2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkRow } from "@/components/links/link-row";

export const metadata: Metadata = { title: "Links" };

function formatLastScan(iso: string | null): string {
  if (!iso) return "noch keine Scans";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function LinksPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data } = await supabase
    .from("link_overview")
    .select("*")
    .order("created_at", { ascending: false });

  const links = data ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Links"
        description="Deine getrackten Kurzlinks – Ziel jederzeit änderbar."
        action={
          <Button render={<Link href="/app/qr/new" />}>
            <Plus className="size-4" />
            Neuer QR-Code
          </Button>
        }
      />

      {links.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Link2 className="size-7" />
            </div>
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold">Noch keine Links</h2>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Getrackte Links entstehen automatisch, wenn du einen QR-Code vom
                Typ „Getrackt" erstellst.
              </p>
            </div>
            <Button render={<Link href="/app/qr/new" />}>
              <Plus className="size-4" />
              Getrackten QR-Code erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {links.map((l) => (
            <LinkRow
              key={l.id}
              id={l.id}
              qrName={l.qr_name}
              shortUrl={`${siteUrl}/r/${l.slug}`}
              destinationUrl={l.destination_url}
              isActive={l.is_active}
              scanCount={Number(l.scan_count ?? 0)}
              lastScanLabel={formatLastScan(l.last_scan)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
