"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <div className="grid max-w-md gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Da ist etwas schiefgelaufen
        </h1>
        <p className="text-sm text-muted-foreground">
          Ein unerwarteter Fehler ist aufgetreten. Versuch es bitte erneut.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Erneut versuchen</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Zur Startseite
        </Button>
      </div>
    </div>
  );
}
