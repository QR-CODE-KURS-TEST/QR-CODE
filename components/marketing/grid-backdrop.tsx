import { cn } from "@/lib/utils";

/**
 * Dekorativer Hintergrund: feines Modul-Raster (QR-Anmutung) + Indigo-Glow.
 * Deterministisch (kein Hydration-Risiko).
 */
export function GridBackdrop({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const lineColor =
    variant === "dark" ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.05)";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Raster */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      {/* Indigo-Glow */}
      <div
        className="absolute left-1/2 top-[-15%] size-[42rem] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.24 277 / 0.55), transparent 60%)",
        }}
      />
    </div>
  );
}
