import {
  Palette,
  BarChart3,
  GitBranch,
  Download,
  Activity,
  ArrowUpRight,
  FileImage,
  FileType,
  FileText,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { QrPreview } from "@/components/qr-editor/qr-preview";
import type { QRDesign } from "@/lib/qr/types";

const base: QRDesign = {
  fgColor: "#4f46e5",
  bgColor: "#ffffff",
  gradient: { enabled: false, color2: "#a855f7", type: "linear", rotation: 45 },
  dotStyle: "rounded",
  cornerSquareStyle: "extra-rounded",
  cornerDotStyle: "dot",
  cornerColor: "#4f46e5",
  logoDataUrl: null,
  logoSizeRatio: 0.3,
  frame: { enabled: false, text: "", color: "#4f46e5" },
};

const GALLERY: QRDesign[] = [
  { ...base, gradient: { enabled: true, color2: "#ec4899", type: "linear", rotation: 45 } },
  {
    ...base,
    fgColor: "#0f172a",
    cornerColor: "#0ea5e9",
    dotStyle: "dots",
    cornerSquareStyle: "dot",
  },
  {
    ...base,
    fgColor: "#059669",
    bgColor: "#ecfdf5",
    cornerColor: "#047857",
    dotStyle: "classy-rounded",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>Features</SectionLabel>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Alles, was ein QR-Code 2026 können muss
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Vom Design über den getrackten Link bis zur Auswertung — ohne
          Tool-Wirrwarr.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-24">
        <FeatureRow
          icon={<Palette className="size-5" />}
          eyebrow="Design-Editor"
          title="QR-Codes, die aussehen wie deine Marke"
          text="Farben, Verläufe, Formen, Ecken, Logo und Call-to-Action-Rahmen — gestalte in Echtzeit, bis es perfekt sitzt. Jeder Code bleibt garantiert scanbar."
          bullets={["Logo & Farbverläufe", 'Frames mit „Scan mich"', "Live-Vorschau"]}
          visual={<DesignGallery />}
        />
        <FeatureRow
          reverse
          icon={<BarChart3 className="size-5" />}
          eyebrow="Echtzeit-Analytics"
          title="Sieh genau, was nach dem Scan passiert"
          text="Jeder Scan landet in deinem Dashboard: Verlauf über Zeit, Geräte, Betriebssysteme und Länder. DSGVO-konform und komplett cookieless."
          bullets={["Scans über Zeit", "Geräte & Standorte", "CSV-Export"]}
          visual={<AnalyticsMock />}
        />
        <FeatureRow
          icon={<GitBranch className="size-5" />}
          eyebrow="Getrackt oder Direkt"
          title="Ein Code – du entscheidest, was er kann"
          text="Getrackte Codes laufen über deinen Kurzlink und zählen jeden Scan – das Ziel änderst du jederzeit, ohne neu zu drucken. Direkte Codes zeigen ohne Umweg auf deine URL."
          bullets={["Ziel jederzeit änderbar", "Eindeutige Kurzlinks", "Pausieren & reaktivieren"]}
          visual={<ModesDiagram />}
        />
        <FeatureRow
          reverse
          icon={<Download className="size-5" />}
          eyebrow="Export"
          title="Druckfertig in jedem Format und jeder Größe"
          text="Exportiere als PNG, SVG oder gestochen scharfes PDF mit 300 DPI – von der Visitenkarte bis zum A3-Plakat. Einmal gestalten, überall einsetzen."
          bullets={["PNG, SVG & PDF", "300 DPI Druckqualität", "Print-Größen-Presets"]}
          visual={<ExportMock />}
        />
      </div>
    </section>
  );
}

function FeatureRow({
  icon,
  eyebrow,
  title,
  text,
  bullets,
  visual,
  reverse,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(reverse && "lg:order-2")}>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {icon}
          {eyebrow}
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="mt-4 text-muted-foreground">{text}</p>
        <ul className="mt-6 grid gap-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm font-medium">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={120} className={cn(reverse && "lg:order-1")}>
        {visual}
      </Reveal>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

/* ── Visuals ──────────────────────────────────────────── */

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-muted/60 to-background p-8">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, oklch(0.6 0.2 277 / 0.12), transparent 50%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function DesignGallery() {
  return (
    <VisualFrame>
      <div className="grid grid-cols-3 gap-4">
        {GALLERY.map((d, i) => (
          <div
            key={i}
            className={cn(
              "flex aspect-square items-center justify-center rounded-2xl bg-white p-3 shadow-sm",
              i === 1 && "translate-y-4",
            )}
          >
            <QrPreview data="https://scanvio.app" design={d} size={120} />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function AnalyticsMock() {
  const bars = [40, 55, 35, 70, 60, 85, 75, 95];
  return (
    <VisualFrame>
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold">Scans über Zeit</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
            <Activity className="size-3" /> +24%
          </span>
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/30 to-primary"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-2.5">
          {[
            { label: "📱 Mobil", v: 72 },
            { label: "💻 Desktop", v: 28 },
          ].map((r) => (
            <div key={r.label} className="grid gap-1">
              <div className="flex justify-between text-xs">
                <span>{r.label}</span>
                <span className="text-muted-foreground">{r.v}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${r.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function ModesDiagram() {
  return (
    <VisualFrame>
      <div className="grid gap-4">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Activity className="size-3" /> Getrackt
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Chip>QR</Chip>
            <Arrow />
            <Chip mono>scanv.io/r/a7x</Chip>
            <Arrow />
            <Chip>deine Seite</Chip>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Jeder Scan wird gezählt · Ziel jederzeit änderbar
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <ArrowUpRight className="size-3" /> Direkt
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Chip>QR</Chip>
            <Arrow />
            <Chip>deine Seite</Chip>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ohne Umweg · kein Tracking
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}

function ExportMock() {
  const formats = [
    { icon: <FileImage className="size-4" />, label: "PNG" },
    { icon: <FileType className="size-4" />, label: "SVG" },
    { icon: <FileText className="size-4" />, label: "PDF" },
  ];
  const sizes = ["Visitenkarte", "Aufkleber 50 mm", "A4", "A3-Plakat"];
  return (
    <VisualFrame>
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          {formats.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-1.5 rounded-xl border bg-background py-4 text-sm font-medium"
            >
              <span className="text-primary">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          {sizes.map((s) => (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <span>{s}</span>
              <Download className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function Chip({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-md border bg-background px-2 py-1 text-xs font-medium",
        mono && "font-mono text-primary",
      )}
    >
      {children}
    </span>
  );
}

function Arrow() {
  return <span className="text-muted-foreground">→</span>;
}
