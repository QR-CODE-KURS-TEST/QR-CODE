import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  isBot,
  hashIp,
  getClientIp,
  parseUserAgent,
  getGeo,
} from "@/lib/tracking/parse";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const headers = request.headers;
  const ua = headers.get("user-agent");
  const supabase = createPublicClient();

  let destination: string | null = null;
  let status = "not_found";

  if (isBot(ua)) {
    // Bots/Vorschauen: nur auflösen, nicht zählen.
    const { data } = await supabase.rpc("resolve_link", { p_slug: slug });
    const row = data?.[0];
    destination = row?.destination ?? null;
    status = row?.status ?? "not_found";
  } else {
    const geo = getGeo(headers);
    const uap = parseUserAgent(ua);
    const { data } = await supabase.rpc("record_scan", {
      p_slug: slug,
      p_ip_hash: hashIp(getClientIp(headers)),
      p_country: geo.country,
      p_region: geo.region,
      p_city: geo.city,
      p_device_type: uap.device_type,
      p_os: uap.os,
      p_browser: uap.browser,
      p_referrer: headers.get("referer"),
      p_user_agent: ua,
    });
    const row = data?.[0];
    destination = row?.destination ?? null;
    status = row?.status ?? "not_found";
  }

  if (status === "ok" && destination) {
    return NextResponse.redirect(destination, 302);
  }

  const reason = status === "inactive" ? "inactive" : "not_found";
  return NextResponse.redirect(`${siteUrl}/link-error?reason=${reason}`, 302);
}
