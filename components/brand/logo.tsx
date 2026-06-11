import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

/** QR-inspirierter Logo-Mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <g className="fill-primary-foreground">
        {/* drei "Finder"-Ecken wie bei einem QR-Code */}
        <path d="M7 7h7v7H7V7Zm2 2v3h3V9H9Z" />
        <path d="M18 7h7v7h-7V7Zm2 2v3h3V9h-3Z" />
        <path d="M7 18h7v7H7v-7Zm2 2v3h3v-3H9Z" />
        {/* Datenpunkte */}
        <rect x="18" y="18" width="2.5" height="2.5" rx="0.5" />
        <rect x="22.5" y="18" width="2.5" height="2.5" rx="0.5" />
        <rect x="18" y="22.5" width="2.5" height="2.5" rx="0.5" />
        <rect x="22.5" y="22.5" width="2.5" height="2.5" rx="0.5" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
      )}
    </span>
  );
}
