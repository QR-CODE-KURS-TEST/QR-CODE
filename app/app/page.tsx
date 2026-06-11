import Link from "next/link";
import { QrCode, Link2, ScanLine, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: qrCount }, { count: linkCount }] = await Promise.all([
    supabase.from("qr_codes").select("*", { count: "exact", head: true }),
    supabase.from("links").select("*", { count: "exact", head: true }),
  ]);

  // Scans der eigenen Links (RLS schränkt automatisch ein)
  const { count: scanCount } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true });

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "willkommen";

  const stats = [
    { label: "QR-Codes", value: qrCount ?? 0, icon: QrCode },
    { label: "Tracking-Links", value: linkCount ?? 0, icon: Link2 },
    { label: "Scans gesamt", value: scanCount ?? 0, icon: ScanLine },
  ];

  const hasContent = (qrCount ?? 0) > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hallo {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Hier ist dein Überblick.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold tabular-nums">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasContent ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <QrCode className="size-7" />
            </div>
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold">Erstelle deinen ersten QR-Code</h2>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Designe ihn nach deinem Geschmack, verlinke ihn und sieh in
                Echtzeit, wer scannt.
              </p>
            </div>
            <Button size="lg" render={<Link href="/app/qr/new" />}>
              <Plus className="size-4" />
              QR-Code erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {(scanCount ?? 0) === 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <ScanLine className="size-6" />
                </div>
                <div className="grid gap-1">
                  <h2 className="font-semibold">Fast geschafft – jetzt den ersten Scan holen!</h2>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground">
                    Lade deinen QR-Code herunter und teste ihn mit dem Handy.
                    Sobald jemand scannt, erscheinen die Daten hier live.
                  </p>
                </div>
                <Button render={<Link href="/app/qr" />}>QR-Code öffnen</Button>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickLink
              href="/app/qr"
              title="QR-Codes verwalten"
              desc="Alle deine Codes ansehen und exportieren."
              icon={QrCode}
            />
            <QuickLink
              href="/app/analytics"
              title="Analytics ansehen"
              desc="Scans, Geräte und Standorte auswerten."
              icon={ScanLine}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon: Icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: typeof QrCode;
}) {
  return (
    <Link href={href}>
      <Card className="group transition-colors hover:border-primary/40">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}
