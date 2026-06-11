import type { Options, Gradient } from "qr-code-styling";
import type { QRDesign } from "./types";

/** Übersetzt unser QRDesign + die zu kodierenden Daten in qr-code-styling-Optionen. */
export function buildQrOptions(
  data: string,
  design: QRDesign,
  size = 320,
): Options {
  const gradient: Gradient | undefined = design.gradient.enabled
    ? {
        type: design.gradient.type,
        rotation: (design.gradient.rotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: design.fgColor },
          { offset: 1, color: design.gradient.color2 },
        ],
      }
    : undefined;

  return {
    width: size,
    height: size,
    type: "canvas",
    data: data || "https://scanvio.app",
    margin: Math.round(size * 0.04),
    image: design.logoDataUrl ?? undefined,
    qrOptions: {
      errorCorrectionLevel: design.logoDataUrl ? "H" : "M",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: design.logoSizeRatio,
      margin: Math.round(size * 0.02),
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      type: design.dotStyle,
      color: design.fgColor,
      gradient,
    },
    backgroundOptions: { color: design.bgColor },
    cornersSquareOptions: {
      type: design.cornerSquareStyle,
      color: design.cornerColor,
    },
    cornersDotOptions: {
      type: design.cornerDotStyle,
      color: design.cornerColor,
    },
  };
}
