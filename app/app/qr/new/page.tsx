import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { QrEditor } from "@/components/qr-editor/qr-editor";

export const metadata: Metadata = { title: "Neuer QR-Code" };

export default function NewQrPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Neuer QR-Code"
        description="Wähle den Typ, gestalte deinen Code und erstelle ihn."
      />
      <QrEditor siteUrl={siteUrl} />
    </div>
  );
}
