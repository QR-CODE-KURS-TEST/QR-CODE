import { createHash } from "node:crypto";
import { UAParser } from "ua-parser-js";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|monitor|curl|wget|python-requests|headless|lighthouse|pingdom|uptime/i;

export function isBot(ua: string | null): boolean {
  if (!ua) return true; // kein User-Agent → wie Bot behandeln
  return BOT_RE.test(ua);
}

/**
 * DSGVO-konformer, pseudonymer IP-Hash. Mit einem Salt versehen, damit die
 * Original-IP nicht rekonstruierbar ist. Dient nur der groben Unterscheidung
 * eindeutiger Scans, nicht der Identifikation.
 */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SCAN_IP_SALT ?? "scanvio-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function getClientIp(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip");
}

export function parseUserAgent(ua: string | null) {
  if (!ua) return { device_type: null, os: null, browser: null };
  const r = new UAParser(ua).getResult();
  return {
    device_type: r.device.type ?? "desktop",
    os: r.os.name ?? null,
    browser: r.browser.name ?? null,
  };
}

/** Geo-Daten aus den Vercel-Edge-Headern (lokal i. d. R. leer). */
export function getGeo(headers: Headers) {
  const dec = (v: string | null) => {
    if (!v) return null;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    country: headers.get("x-vercel-ip-country"),
    region: headers.get("x-vercel-ip-country-region"),
    city: dec(headers.get("x-vercel-ip-city")),
  };
}
