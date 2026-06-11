"use server";

import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { canCreateTrackedQr } from "@/lib/plan/limits";
import { normalizeUrl } from "@/lib/url";
import type { PlanTier } from "@/lib/constants";
import type { QRDesign } from "@/lib/qr/types";

// URL-sichere, eindeutige Slugs ohne verwechselbare Zeichen (0/o, 1/l).
const makeSlug = customAlphabet("23456789abcdefghijkmnpqrstuvwxyz", 7);

export type CreateQrInput = {
  name: string;
  mode: "tracked" | "direct";
  destinationUrl: string;
  design: QRDesign;
};

type CreateResult =
  | { id: string }
  | { error: string; limitReached?: boolean };

export async function createQrCode(input: CreateQrInput): Promise<CreateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const destination = normalizeUrl(input.destinationUrl);
  if (!destination) return { error: "Bitte gib eine gültige URL ein." };

  const name = input.name.trim() || "Unbenannter QR-Code";

  if (input.mode === "tracked") {
    // Plan-Limit prüfen
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    const plan = (profile?.plan ?? "free") as PlanTier;

    const { count } = await supabase
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("type", "tracked");

    if (!canCreateTrackedQr(plan, count ?? 0)) {
      return {
        error:
          "Du hast das Limit an getrackten QR-Codes für deinen Plan erreicht.",
        limitReached: true,
      };
    }

    // Link mit eindeutigem Slug anlegen (bei Kollision erneut versuchen)
    let linkId: string | null = null;
    for (let attempt = 0; attempt < 5 && !linkId; attempt++) {
      const slug = makeSlug();
      const { data, error } = await supabase
        .from("links")
        .insert({ user_id: user.id, slug, destination_url: destination })
        .select("id")
        .single();
      if (!error && data) linkId = data.id;
      else if (error && error.code !== "23505") {
        return { error: "Link konnte nicht erstellt werden." };
      }
    }
    if (!linkId) return { error: "Bitte versuche es erneut." };

    const { data: qr, error: qrError } = await supabase
      .from("qr_codes")
      .insert({
        user_id: user.id,
        name,
        type: "tracked",
        design: input.design,
        link_id: linkId,
      })
      .select("id")
      .single();
    if (qrError || !qr) return { error: "QR-Code konnte nicht gespeichert werden." };

    revalidatePath("/app/qr");
    return { id: qr.id };
  }

  // Direct-Modus
  const { data: qr, error } = await supabase
    .from("qr_codes")
    .insert({
      user_id: user.id,
      name,
      type: "static",
      design: input.design,
      target_url: destination,
    })
    .select("id")
    .single();
  if (error || !qr) return { error: "QR-Code konnte nicht gespeichert werden." };

  revalidatePath("/app/qr");
  return { id: qr.id };
}

export async function deleteQrCode(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht angemeldet." };

  const { data: qr } = await supabase
    .from("qr_codes")
    .select("link_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("qr_codes").delete().eq("id", id);
  if (error) return { error: "Löschen fehlgeschlagen." };

  // Zugehörigen Tracking-Link (und via Cascade dessen Scans) entfernen.
  if (qr?.link_id) {
    await supabase.from("links").delete().eq("id", qr.link_id);
  }

  revalidatePath("/app/qr");
  return {};
}
