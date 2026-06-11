import { createClient } from "@supabase/supabase-js";

/** Ob der Service-Role-Key gesetzt ist (für Webhook/Sync nötig). */
export function hasServiceRole(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/**
 * Supabase-Admin-Client mit Service-Role-Key – umgeht RLS.
 * NUR serverseitig (Webhook, Post-Checkout-Sync) verwenden.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY fehlt – für Stripe-Webhook/Sync erforderlich.",
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
