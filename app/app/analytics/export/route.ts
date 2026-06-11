import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PlanTier } from "@/lib/constants";

export const dynamic = "force-dynamic";

type ScanRow = {
  ts: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  referrer: string | null;
  links: { slug: string } | { slug: string }[] | null;
};

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.plan ?? "free") as PlanTier;
  if (plan === "free") {
    return NextResponse.redirect(new URL("/app/settings/billing", request.url));
  }

  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("range")) || 30, 3650);
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data } = await supabase
    .from("scans")
    .select(
      "ts, country, region, city, device_type, os, browser, referrer, links!inner(slug)",
    )
    .gte("ts", since)
    .order("ts", { ascending: false })
    .limit(50000);

  const rows = (data ?? []) as ScanRow[];

  const header = [
    "Zeitpunkt",
    "Land",
    "Region",
    "Stadt",
    "Gerät",
    "Betriebssystem",
    "Browser",
    "Referrer",
    "Slug",
  ];

  const lines = rows.map((r) => {
    const slug = Array.isArray(r.links) ? r.links[0]?.slug : r.links?.slug;
    return [
      r.ts,
      r.country,
      r.region,
      r.city,
      r.device_type,
      r.os,
      r.browser,
      r.referrer,
      slug,
    ]
      .map(csvCell)
      .join(",");
  });

  // BOM für korrekte Umlaute in Excel
  const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="scanvio-scans-${days}t.csv"`,
    },
  });
}
