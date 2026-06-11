import Link from "next/link";
import { ArrowRight, TrendingUp, ScanLine, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrPreview } from "@/components/qr-editor/qr-preview";
import { GridBackdrop } from "./grid-backdrop";
import type { QRDesign } from "@/lib/qr/types";

const HERO_DESIGN: QRDesign = {
  fgColor: "#6366f1",
  bgColor: "#ffffff",
  gradient: { enabled: true, color2: "#a855f7", type: "linear", rotation: 45 },
  dotStyle: "extra-rounded",
  cornerSquareStyle: "extra-rounded",
  cornerDotStyle: "dot",
  cornerColor: "#4f46e5",
  logoDataUrl: null,
  logoSizeRatio: 0.3,
  frame: { enabled: false, text: "", color: "#4f46e5" },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.17_0.03_277)] text-white">
      <GridBackdrop />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-40">
        {/* Text */}
        <div>
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-indigo-400" />
            </span>
            Designen · Kürzen · Tracken — alles an einem Ort
          </div>

          <h1
            className="animate-fade-up mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            QR-Codes, die{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                verkaufen
              </span>
            </span>
            .
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-md text-lg text-white/70"
            style={{ animationDelay: "160ms" }}
          >
            Gestalte QR-Codes, die zu deiner Marke passen, kürze deine Links und
            sieh in Echtzeit, wer, wann und wo scannt. In 30 Sekunden startklar.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Button
              size="lg"
              className="h-12 px-6 text-base"
              render={<Link href="/signup" />}
            >
              Kostenlos starten
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
              render={<Link href="#features" />}
            >
              So funktioniert's
            </Button>
          </div>

          <div
            className="animate-fade-up mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60"
            style={{ animationDelay: "320ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-indigo-300" />
              Keine Kreditkarte nötig
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-indigo-300" />
              DSGVO-konform
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-indigo-300" />
              In 30 Sek. startklar
            </span>
          </div>
        </div>

        {/* Visual */}
        <div
          className="animate-fade-up relative mx-auto w-full max-w-sm"
          style={{ animationDelay: "200ms" }}
        >
          <div className="animate-float relative">
            {/* QR-Karte */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <div className="relative mx-auto flex aspect-square w-full max-w-[230px] items-center justify-center rounded-2xl bg-white p-4">
                <QrPreview data="https://scanvio.app" design={HERO_DESIGN} size={200} />
                <div
                  className="pointer-events-none absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                  style={{ animation: "scan-line 3.2s ease-in-out infinite", top: 0 }}
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-medium text-white">Speisekarte · Tisch 7</div>
                <div className="font-mono text-xs text-white/50">scanv.io/r/a7x9k2</div>
              </div>
            </div>

            {/* Floating: Scans */}
            <div className="absolute -right-4 -top-5 rounded-2xl border border-white/10 bg-[oklch(0.2_0.03_277_/_0.9)] p-3 shadow-xl backdrop-blur-md sm:-right-8">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                  <ScanLine className="size-4" />
                </div>
                <div>
                  <div className="text-base font-semibold leading-none text-white">
                    1.248
                  </div>
                  <div className="text-[10px] text-white/50">Scans gesamt</div>
                </div>
              </div>
              <div className="mt-2 flex items-end gap-0.5">
                {[5, 8, 6, 11, 9, 14, 12].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500/40 to-indigo-400"
                    style={{ height: `${h * 1.4}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Floating: Trend */}
            <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-[oklch(0.2_0.03_277_/_0.9)] p-3 shadow-xl backdrop-blur-md sm:-left-8">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <div className="text-base font-semibold leading-none text-white">
                  +24%
                </div>
                <div className="text-[10px] text-white/50">diese Woche</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Übergang nach unten */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
