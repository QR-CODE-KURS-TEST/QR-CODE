# Scanvio — QR-Code-SaaS

Designbare QR-Codes, getrackte Short-Links und Echtzeit-Analytics. Next.js 16 · Supabase · Stripe · Tailwind v4 / shadcn (base-ui).

---

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                  # http://localhost:3000
```

**Build / Typecheck:** `npm run build`

### Hilfs-Skripte

| Befehl | Zweck |
| --- | --- |
| `node scripts/db-exec.mjs supabase/migrations/<f>.sql` | Migration ausführen |
| `node scripts/db-check.mjs` | Tabellen + RLS prüfen |
| `node scripts/stripe-setup.mjs` | Stripe-Produkte/Preise anlegen (idempotent) |
| `node scripts/create-user.mjs <email> <pw> [name]` | Bestätigten Test-User anlegen (ohne Mail) |
| `node scripts/set-plan.mjs <email> <free\|pro\|business>` | Plan lokal setzen (Gating testen) |

> **Demo-Login (lokal):** `demo.scanvio@gmail.com` / `Scanvio2026!`

---

## Environment-Variablen

| Variable | Öffentlich | Zweck |
| --- | :---: | --- |
| `NEXT_PUBLIC_SITE_URL` | ✓ | Basis-URL (lokal `http://localhost:3000`, in Prod die Vercel-Domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | Supabase-Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | Supabase Publishable/Anon-Key |
| `SUPABASE_SERVICE_ROLE_KEY` | — | **Für Webhook & Post-Checkout-Sync.** Supabase → Project Settings → API |
| `SUPABASE_DB_URL` | — | Direkte Postgres-URL (nur für Migrations-Skripte, nicht zur Laufzeit nötig) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✓ | Stripe Publishable Key |
| `STRIPE_SECRET_KEY` | — | Stripe Secret Key |
| `STRIPE_WEBHOOK_SECRET` | — | **Signing-Secret des Webhook-Endpoints** (siehe unten) |
| `STRIPE_PRICE_PRO_MONTHLY` … `_BUSINESS_YEARLY` | — | Price-IDs (via `stripe-setup.mjs`) |
| `SCAN_IP_SALT` | — | (optional) Salt für IP-Hashing im Tracking |

---

## Deployment auf Vercel

### 1. Repository pushen & importieren
- Repo zu GitHub pushen, in Vercel **New Project → Import**.
- Framework wird als Next.js erkannt. Kein Custom-Build nötig.

### 2. Environment-Variablen setzen
Alle Variablen aus der Tabelle oben in Vercel (Project → Settings → Environment Variables) eintragen.
- `NEXT_PUBLIC_SITE_URL` = die finale Vercel-/Custom-Domain (z. B. `https://scanvio.app`).
- `SUPABASE_SERVICE_ROLE_KEY` aus dem Supabase-Dashboard ergänzen (war lokal noch offen).

### 3. Supabase-Dashboard konfigurieren
- **Authentication → URL Configuration:** Site-URL = Prod-Domain; Redirect-URLs:
  `https://<deine-domain>/auth/callback` (und für lokal `http://localhost:3000/auth/callback`).
- **Authentication → Providers:** Google & Apple aktivieren (Client-ID/Secret hinterlegen).
- E-Mail/Passwort ist standardmäßig aktiv. Für mehr E-Mail-Volumen eigenen SMTP hinterlegen
  (der Supabase-Default ist stark gedrosselt).

### 4. Stripe-Webhook einrichten
- Stripe-Dashboard → **Developers → Webhooks → Add endpoint**
  - URL: `https://<deine-domain>/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.created`,
    `customer.subscription.updated`, `customer.subscription.deleted`
- Das **Signing secret** (`whsec_…`) als `STRIPE_WEBHOOK_SECRET` in Vercel eintragen.
- Für Live-Betrieb: in Stripe auf **Live-Mode** wechseln, neue Keys + Webhook anlegen,
  `node scripts/stripe-setup.mjs` mit Live-Key erneut ausführen und die Live-Price-IDs setzen.

### 5. Redeploy
Nach dem Setzen der Variablen einmal **Redeploy** auslösen.

---

## Architektur (Kurzüberblick)

- **Auth/Schutz:** `proxy.ts` (Next 16 „proxy"-Konvention) schützt `/app/*`.
- **QR-Engine:** `lib/qr/*`, Editor unter `components/qr-editor/*`, Export PNG/PDF/SVG.
- **Redirect/Tracking:** `app/r/[slug]/route.ts` → DB-RPC `record_scan` (SECURITY DEFINER,
  daher ohne Service-Role-Key lauffähig), DSGVO-konform (IP gehasht, cookieless).
- **Analytics:** RLS-sichere RPCs (`scan_timeseries`, `scan_breakdown`, …) +
  Recharts unter `components/charts/*`.
- **Billing:** `lib/stripe/*`, Webhook `app/api/stripe/webhook`, Plan-Limits `lib/plan/limits.ts`.
- **Marketing:** Landing in `app/page.tsx` + `components/marketing/*`.

## Pre-Launch-Checkliste
- [ ] Env-Variablen in Vercel vollständig (inkl. `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_WEBHOOK_SECRET`)
- [ ] Supabase Redirect-URLs + Google/Apple-Provider konfiguriert
- [ ] Stripe-Webhook angelegt & getestet (Test-Checkout → Plan wird aktiv)
- [ ] `NEXT_PUBLIC_SITE_URL` auf Prod-Domain
- [ ] Impressum / Datenschutz / AGB mit echten Inhalten gefüllt (`app/legal/*`)
- [ ] DB-Passwort rotiert (war im Chat geteilt)
- [ ] Stripe Live-Mode-Keys + Live-Price-IDs (vor echten Zahlungen)
