import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridBackdrop } from "./grid-backdrop";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="px-5 py-16">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[oklch(0.17_0.03_277)] px-6 py-20 text-center text-white">
        <GridBackdrop />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Dein erster QR-Code ist in 30 Sekunden fertig
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Kostenlos starten, keine Kreditkarte. Designen, tracken, wachsen.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-7 text-base"
              render={<Link href="/signup" />}
            >
              Jetzt kostenlos starten
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white"
              render={<Link href="#preise" />}
            >
              Preise ansehen
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
