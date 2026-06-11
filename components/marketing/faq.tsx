"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Was ist der Unterschied zwischen getrackten und direkten QR-Codes?",
    a: "Getrackte Codes laufen über unseren Kurzlink: Jeder Scan wird gezählt und du kannst das Ziel jederzeit ändern, ohne neu zu drucken. Direkte Codes enthalten deine URL unmittelbar – schnell, aber ohne Statistik und nicht änderbar.",
  },
  {
    q: "Bleiben meine QR-Codes für immer gültig?",
    a: "Ja. Erstellte Codes bleiben bestehen. Bei getrackten Codes ändert sich höchstens das Ziel – die gedruckte Grafik funktioniert weiter.",
  },
  {
    q: "Ist das Tracking DSGVO-konform?",
    a: "Ja. Wir speichern keine personenbezogenen Daten und setzen keine Cookies. IP-Adressen werden ausschließlich gehasht und pseudonymisiert verarbeitet.",
  },
  {
    q: "In welchen Formaten kann ich exportieren?",
    a: "PNG, SVG und druckfertiges PDF mit 300 DPI – inklusive Größen-Presets von der Visitenkarte bis zum A3-Plakat. SVG und PDF sind ab dem Pro-Plan verfügbar.",
  },
  {
    q: "Brauche ich technisches Wissen?",
    a: "Nein. In unter einer Minute steht dein erster Code – gestalten, Ziel eintragen, fertig. Kein Code, keine Installation.",
  },
  {
    q: "Kann ich jederzeit kündigen?",
    a: "Ja, monatlich kündbar mit einem Klick im Kundenportal. Es gibt keine Mindestlaufzeit.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Häufige Fragen
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Noch offen? Schreib uns – wir helfen gern.
        </p>
      </div>

      <Accordion className="mt-12">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b">
            <AccordionTrigger className="py-5 text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
