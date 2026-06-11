"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/url";

export async function toggleLinkActive(
  id: string,
  active: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("links")
    .update({ is_active: active })
    .eq("id", id);
  if (error) return { error: "Aktualisierung fehlgeschlagen." };
  revalidatePath("/app/links");
  return {};
}

export async function updateLinkDestination(
  id: string,
  url: string,
): Promise<{ error?: string }> {
  const dest = normalizeUrl(url);
  if (!dest) return { error: "Bitte gib eine gültige URL ein." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("links")
    .update({ destination_url: dest })
    .eq("id", id);
  if (error) return { error: "Aktualisierung fehlgeschlagen." };
  revalidatePath("/app/links");
  return {};
}
