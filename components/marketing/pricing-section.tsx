import { Reveal } from "./reveal";
import { PricingTable } from "@/components/billing/pricing-table";

export function PricingSection() {
  return (
    <section id="preise" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preise
        </span>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Fair, transparent, jederzeit kündbar
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Starte kostenlos. Upgrade, wenn du mehr brauchst – nicht vorher.
        </p>
      </Reveal>

      <div className="mt-14">
        <PricingTable mode="signup" />
      </div>
    </section>
  );
}
