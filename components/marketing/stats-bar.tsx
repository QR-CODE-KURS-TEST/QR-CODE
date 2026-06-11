import { Reveal } from "./reveal";

const STATS = [
  { value: "30 Sek.", label: "bis zum ersten Code" },
  { value: "100%", label: "DSGVO-konform, cookieless" },
  { value: "8+", label: "Export-Formate & Größen" },
  { value: "∞", label: "direkte QR-Codes – gratis" },
];

export function StatsBar() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 80}
            className="flex flex-col items-center gap-0.5 px-4 py-6 text-center"
          >
            <div className="font-display text-3xl font-bold tracking-tight text-foreground">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
