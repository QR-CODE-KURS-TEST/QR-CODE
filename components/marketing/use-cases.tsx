import {
  UtensilsCrossed,
  Ticket,
  Package,
  Store,
  Building2,
  Contact,
} from "lucide-react";
import { Reveal } from "./reveal";

const CASES = [
  {
    icon: UtensilsCrossed,
    title: "Gastronomie",
    text: "Digitale Speisekarten am Tisch – Karte ändern, ohne neu zu drucken.",
  },
  {
    icon: Ticket,
    title: "Events & Tickets",
    text: "Einlass, Programme und Feedback-Formulare direkt auf dem Ticket.",
  },
  {
    icon: Package,
    title: "Print & Verpackung",
    text: "Flyer, Plakate und Produkte, die du nach dem Druck weiter steuerst.",
  },
  {
    icon: Store,
    title: "Einzelhandel",
    text: "Bewertungen, Aktionen und Treueprogramme am Point of Sale.",
  },
  {
    icon: Building2,
    title: "Immobilien",
    text: "Exposés und Besichtigungstermine direkt am Schild oder Schaufenster.",
  },
  {
    icon: Contact,
    title: "Visitenkarten",
    text: "Kontakt, Portfolio und Social-Profile mit einem Scan teilen.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-20 border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Ein Tool für jeden Touchpoint
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Überall dort, wo Menschen auf deine Marke treffen.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 80}>
              <div className="group h-full rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
