import Link from "next/link";
import type { Metadata } from "next";
import { Link2Off } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Link nicht verfügbar",
  robots: { index: false },
};

export default async function LinkErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const inactive = reason === "inactive";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Link2Off className="size-8" />
      </div>
      <div className="grid max-w-md gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {inactive ? "Dieser Link ist pausiert" : "Link nicht gefunden"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {inactive
            ? "Der Besitzer dieses QR-Codes hat den Link vorübergehend deaktiviert. Bitte versuche es später erneut."
            : "Dieser QR-Code zeigt auf einen Link, den es nicht (mehr) gibt."}
        </p>
      </div>
      <Button render={<Link href="/" />} variant="outline">
        Zu {APP_NAME}
      </Button>
    </div>
  );
}
