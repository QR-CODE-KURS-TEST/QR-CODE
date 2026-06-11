import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "E-Mail bestätigen" };

export default function CheckEmailPage() {
  return (
    <div className="grid gap-6 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16v12H4z" strokeLinejoin="round" />
          <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Fast geschafft!</h1>
        <p className="text-sm text-muted-foreground">
          Wir haben dir eine Bestätigungs-E-Mail geschickt. Klick auf den Link
          darin, um dein Konto zu aktivieren.
        </p>
      </div>
      <Button variant="outline" render={<Link href="/login" />}>
        Zurück zur Anmeldung
      </Button>
    </div>
  );
}
