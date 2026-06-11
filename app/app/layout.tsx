import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo, LogoMark } from "@/components/brand/logo";
import { SidebarNav, MobileTabBar } from "@/components/app/sidebar-nav";
import { UserMenu } from "@/components/app/user-menu";
import { UpgradeCard } from "@/components/app/upgrade-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_LABELS, type PlanTier } from "@/lib/constants";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as PlanTier;
  const name = profile?.full_name ?? (user.user_metadata?.full_name as string);

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop-Sidebar */}
      <aside className="sticky top-0 hidden h-svh flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/app">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarNav />
        </div>
        <div className="p-3">{plan === "free" && <UpgradeCard />}</div>
      </aside>

      {/* Hauptbereich */}
      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Link href="/app" className="lg:hidden">
            <LogoMark />
          </Link>
          <div className="flex flex-1 items-center justify-end gap-3">
            <Badge
              variant={plan === "free" ? "secondary" : "default"}
              className="hidden sm:inline-flex"
            >
              {PLAN_LABELS[plan]}
            </Badge>
            <Button size="sm" render={<Link href="/app/qr/new" />}>
              <Plus className="size-4" />
              <span className="hidden sm:inline">Neuer QR-Code</span>
            </Button>
            <UserMenu
              name={name}
              email={user.email}
              avatarUrl={profile?.avatar_url}
            />
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:pb-10">{children}</main>
      </div>

      <MobileTabBar />
    </div>
  );
}
