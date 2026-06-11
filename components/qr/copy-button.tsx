"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Link kopiert.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Kopieren fehlgeschlagen.");
    }
  }

  return (
    <Button variant="outline" size="icon-sm" onClick={copy} aria-label="Kopieren">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}
