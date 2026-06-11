"use client";

import { useActionState } from "react";
import { signUpWithPassword } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, action, pending] = useActionState(
    signUpWithPassword,
    undefined,
  );

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full_name">Name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          placeholder="Max Mustermann"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="du@beispiel.de"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mindestens 8 Zeichen"
          minLength={8}
          required
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Konto wird erstellt…" : "Kostenlos starten"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Mit der Registrierung stimmst du unseren{" "}
        <a href="/legal/agb" className="underline hover:text-foreground">
          AGB
        </a>{" "}
        und der{" "}
        <a href="/legal/datenschutz" className="underline hover:text-foreground">
          Datenschutzerklärung
        </a>{" "}
        zu.
      </p>
    </form>
  );
}
