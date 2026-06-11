"use client";

import { useEffect, useRef } from "react";
import type QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/lib/qr/options";
import type { QRDesign } from "@/lib/qr/types";

/**
 * Live-Vorschau des QR-Codes via qr-code-styling.
 * Bei aktivem Rahmen wird dieser per CSS um den Code gelegt (Vorschau);
 * der Export rastert den Rahmen pixelgenau (siehe lib/qr/export.ts).
 */
export function QrPreview({
  data,
  design,
  size = 280,
}: {
  data: string;
  design: QRDesign;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const QRCodeStylingCtor = (await import("qr-code-styling")).default;
      if (!active || !ref.current) return;
      const options = buildQrOptions(data, design, size);
      if (!qrRef.current) {
        qrRef.current = new QRCodeStylingCtor(options);
        ref.current.innerHTML = "";
        qrRef.current.append(ref.current);
      } else {
        qrRef.current.update(options);
      }
    })();
    return () => {
      active = false;
    };
  }, [data, design, size]);

  if (design.frame.enabled) {
    return (
      <div
        className="inline-flex flex-col items-center rounded-2xl bg-white p-3"
        style={{ border: `${Math.max(3, size * 0.018)}px solid ${design.frame.color}` }}
      >
        <div ref={ref} className="[&>canvas]:block [&>svg]:block" />
        <span
          className="mt-2 text-center text-sm font-bold tracking-wide"
          style={{ color: design.frame.color }}
        >
          {design.frame.text.toUpperCase()}
        </span>
      </div>
    );
  }

  return <div ref={ref} className="[&>canvas]:block [&>svg]:block" />;
}
