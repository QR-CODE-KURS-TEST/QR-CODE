import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="font-display text-7xl font-extrabold tracking-tight text-primary">
        404
      </div>
      <div className="grid max-w-md gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="text-sm text-muted-foreground">
          Diese Seite gibt es nicht (mehr). Vielleicht hilft dir der Weg zurück.
        </p>
      </div>
      <div className="flex gap-3">
        <Button render={<Link href="/" />}>Zur Startseite</Button>
        <Button variant="outline" render={<Link href="/app" />}>
          Zum Dashboard
        </Button>
      </div>
    </div>
  );
}
