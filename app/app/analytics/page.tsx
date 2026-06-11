import Link from "next/link";
import type { Metadata } from "next";
import {
  ScanLine,
  Users,
  Clock,
  Smartphone,
  MonitorSmartphone,
  Globe,
  QrCode,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScansAreaChart } from "@/components/charts/scans-area-chart";
import { BreakdownCard } from "@/components/charts/breakdown-card";
import { RangeTabs } from "@/components/analytics/range-tabs";
import { ExportButton } from "@/components/analytics/export-button";
import { PLAN_LIMITS } from "@/lib/plan/limits";
import type { PlanTier } from "@/lib/constants";

export const metadata: Metadata = { title: "Analytics" };

type Row = { label: string; scans: number };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();
  const plan = (profile?.plan ?? "free") as PlanTier;

  // Zeitfenster: Free auf 7 Tage begrenzt
  const requested = Number(range) || 7;
  const maxDays = PLAN_LIMITS[plan].analyticsDays;
  const days = Math.min(requested, maxDays === Infinity ? requested : maxDays);

  const [overview, series, byDevice, byOs, byCountry, topQr] =
    await Promise.all([
      supabase.rpc("analytics_overview", { p_days: days }),
      supabase.rpc("scan_timeseries", { p_days: days }),
      supabase.rpc("scan_breakdown", { p_dimension: "device_type", p_days: days }),
      supabase.rpc("scan_breakdown", { p_dimension: "os", p_days: days }),
      supabase.rpc("scan_breakdown", { p_dimension: "country", p_days: days }),
      supabase.rpc("top_qr", { p_days: days }),
    ]);

  const ov = overview.data?.[0] ?? { total: 0, visitors: 0, last24h: 0 };
  const timeseries = (series.data ?? []) as { day: string; scans: number }[];
  const devices = (byDevice.data ?? []) as Row[];
  const systems = (byOs.data ?? []) as Row[];
  const countries = (byCountry.data ?? []) as Row[];
  const top = (topQr.data ?? []) as {
    qr_id: string;
    name: string;
    scans: number;
  }[];

  const stats = [
    { label: "Scans gesamt", value: ov.total, icon: ScanLine },
    { label: "Eindeutige Besucher", value: ov.visitors, icon: Users },
    { label: "Letzte 24 h", value: ov.last24h, icon: Clock },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Analytics"
        description={`Scan-Auswertung der letzten ${days} Tage.`}
        action={<ExportButton plan={plan} range={days} />}
      />

      <div className="mb-6">
        <RangeTabs current={days} plan={plan} />
      </div>

      {/* Kennzahlen */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold tabular-nums">
                  {Number(value)}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zeitreihe */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Scans über Zeit</CardTitle>
        </CardHeader>
        <CardContent>
          <ScansAreaChart data={timeseries} />
        </CardContent>
      </Card>

      {/* Verteilungen */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <BreakdownCard
          title="Geräte"
          icon={<Smartphone className="size-4 text-muted-foreground" />}
          data={devices}
          chartVar="--chart-1"
        />
        <BreakdownCard
          title="Betriebssysteme"
          icon={<MonitorSmartphone className="size-4 text-muted-foreground" />}
          data={systems}
          chartVar="--chart-2"
        />
        <BreakdownCard
          title="Länder"
          icon={<Globe className="size-4 text-muted-foreground" />}
          data={countries}
          chartVar="--chart-3"
        />
      </div>

      {/* Top QR-Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top QR-Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {top.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Noch keine getrackten Scans.
            </p>
          ) : (
            <div className="grid gap-1">
              {top.map((q) => (
                <Link
                  key={q.qr_id}
                  href={`/app/qr/${q.qr_id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                >
                  <span className="flex items-center gap-2 truncate text-sm">
                    <QrCode className="size-4 text-muted-foreground" />
                    {q.name}
                  </span>
                  <span className="tabular-nums text-sm font-medium">
                    {Number(q.scans)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
