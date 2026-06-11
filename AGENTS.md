<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Scanvio — QR-Code-SaaS (Arbeitstitel)

Verkaufsstarkes QR-Code-SaaS: designbare QR-Codes, getrackte Short-Links, Echtzeit-Analytics. Deutsch, mobile-first. Masterplan liegt unter `~/.claude/plans/ich-m-chte-ein-qr-code-atomic-hummingbird.md`.

## Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind v4 + shadcn/ui (**base-ui-basiert**, nicht Radix)
- Supabase (Auth/Postgres/Storage) via `@supabase/ssr`
- Stripe (Billing, Phase 4), Vercel (Hosting)

## Wichtige Konventionen
- **shadcn nutzt base-ui**: Komposition via `render`-Prop, **nicht** `asChild`.
  Beispiel: `<Button render={<Link href="/x" />}>Text</Button>`.
- Supabase-Clients: `lib/supabase/{client,server,middleware}.ts`. In Server-Components
  `createClient()` aus `server.ts` (async, cookie-basiert).
- Auth-Schutz läuft über `proxy.ts` (Next-16-Konvention, ersetzt `middleware.ts`) – `/app/*` erfordert Login.
- Geschützter App-Bereich liegt unter dem **literalen** Segment `app/app/` → URLs `/app/*`.
  Auth-Seiten in der Route-Group `app/(auth)/` → `/login`, `/signup`.

## Befehle
- Dev: `npm run dev`  ·  Build/Typecheck: `npm run build`
- DB-Migration ausführen: `node scripts/db-exec.mjs supabase/migrations/<datei>.sql`
- DB-Schema prüfen: `node scripts/db-check.mjs`
- Stripe-Produkte/Preise anlegen: `node scripts/stripe-setup.mjs`
- Test-User anlegen (bestätigt, ohne Mail): `node scripts/create-user.mjs <email> <pw> [name]`
- Plan lokal setzen (Gating testen): `node scripts/set-plan.mjs <email> <free|pro|business>`

## Env
Secrets in `.env.local` (gitignored). Vorlage: `.env.example`.
Stripe-Price-IDs sind gesetzt (Pro/Business, monatlich/jährlich).
**Noch ausstehend (kommt auf Vercel):** `SUPABASE_SERVICE_ROLE_KEY` (Webhook/Post-Checkout-Sync)
und `STRIPE_WEBHOOK_SECRET`. Solange beide fehlen, schaltet Checkout den Plan lokal NICHT
automatisch um – dafür `scripts/set-plan.mjs` nutzen. Webhook-Code (`app/api/stripe/webhook`)
+ Post-Checkout-Sync greifen automatisch, sobald die Keys auf Vercel gesetzt sind.

## Supabase-Dashboard-Konfiguration (manuell nötig)
- Auth → URL Configuration: Site-URL + Redirect-URL `http://localhost:3000/auth/callback`
  (und Prod-URL) eintragen.
- Auth → Providers: Google & Apple aktivieren (Client-ID/Secret hinterlegen).
- E-Mail/Passwort ist standardmäßig aktiv (Bestätigungsmail via Supabase-SMTP).
