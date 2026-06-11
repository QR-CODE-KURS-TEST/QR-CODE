import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-Client ohne Auth-Session – für öffentliche RPC-Aufrufe
 * (z. B. Scan-Logging in der Redirect-Route).
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
