"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const KEY = "scanvio-privacy-ack";

export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage nicht verfügbar */
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-muted-foreground">
          Wir nutzen nur technisch notwendige Cookies für die Anmeldung. Unser
          Scan-Tracking ist <strong className="text-foreground">cookieless</strong>{" "}
          und DSGVO-konform.{" "}
          <Link href="/legal/datenschutz" className="underline hover:text-foreground">
            Mehr erfahren
          </Link>
          .
        </p>
        <Button size="sm" onClick={dismiss} className="shrink-0">
          Verstanden
        </Button>
      </div>
    </div>
  );
}
