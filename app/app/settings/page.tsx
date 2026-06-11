import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PLAN_LABELS, type PlanTier } from "@/lib/constants";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user!.id)
    .single();

  const plan = (profile?.plan ?? "free") as PlanTier;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Einstellungen" description="Verwalte dein Konto." />

      <Card>
        <CardHeader>
          <CardTitle>Konto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={profile?.full_name ?? ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" defaultValue={user?.email ?? ""} disabled />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="text-sm font-medium">Aktueller Plan</div>
              <div className="text-xs text-muted-foreground">
                Dein aktives Abo.
              </div>
            </div>
            <Badge variant={plan === "free" ? "secondary" : "default"}>
              {PLAN_LABELS[plan]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
