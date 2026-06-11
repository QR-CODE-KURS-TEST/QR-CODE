// Client-seitige Export-Helfer: PNG (mit optionalem Rahmen), SVG und PDF.
import { buildQrOptions } from "./options";
import type { QRDesign } from "./types";

async function loadQrLib() {
  return (await import("qr-code-styling")).default;
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/** Rendert den QR-Code (inkl. Rahmen, falls aktiv) in ein Canvas. */
export async function renderQrCanvas(
  data: string,
  design: QRDesign,
  qrSize: number,
): Promise<HTMLCanvasElement> {
  const QRCodeStyling = await loadQrLib();
  const qr = new QRCodeStyling(buildQrOptions(data, design, qrSize));
  const blob = (await qr.getRawData("png")) as Blob;
  const img = await blobToImage(blob);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  if (!design.frame.enabled) {
    canvas.width = qrSize;
    canvas.height = qrSize;
    ctx.drawImage(img, 0, 0, qrSize, qrSize);
    return canvas;
  }

  const pad = Math.round(qrSize * 0.05);
  const labelH = Math.round(qrSize * 0.16);
  const radius = Math.round(qrSize * 0.06);
  const lw = Math.max(4, Math.round(qrSize * 0.022));

  canvas.width = qrSize + pad * 2;
  canvas.height = qrSize + pad * 2 + labelH;

  // weißer, abgerundeter Hintergrund
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 0, 0, canvas.width, canvas.height, radius);
  ctx.fill();

  // farbiger Rahmen
  ctx.strokeStyle = design.frame.color;
  ctx.lineWidth = lw;
  roundRect(
    ctx,
    lw / 2,
    lw / 2,
    canvas.width - lw,
    canvas.height - lw,
    radius,
  );
  ctx.stroke();

  // QR-Code
  ctx.drawImage(img, pad, pad, qrSize, qrSize);

  // CTA-Text
  ctx.fillStyle = design.frame.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.round(qrSize * 0.078);
  ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(
    design.frame.text.toUpperCase(),
    canvas.width / 2,
    qrSize + pad * 2 + labelH / 2,
    canvas.width - pad * 2,
  );

  return canvas;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadPng(
  data: string,
  design: QRDesign,
  size: number,
  filename: string,
) {
  const canvas = await renderQrCanvas(data, design, size);
  triggerDownload(canvas.toDataURL("image/png"), `${filename}.png`);
}

export async function downloadSvg(
  data: string,
  design: QRDesign,
  filename: string,
) {
  // SVG = reiner QR-Code (vektoriell, ohne gerasterten Rahmen).
  const QRCodeStyling = await loadQrLib();
  const qr = new QRCodeStyling({
    ...buildQrOptions(data, design, 1000),
    type: "svg",
  });
  const blob = (await qr.getRawData("svg")) as Blob;
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${filename}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type PdfFormatKey =
  | "business_card"
  | "sticker_50"
  | "a6"
  | "a5"
  | "a4"
  | "a3";

export const PDF_FORMATS: Record<
  PdfFormatKey,
  { label: string; w: number; h: number }
> = {
  business_card: { label: "Visitenkarte (85×55 mm)", w: 85, h: 55 },
  sticker_50: { label: "Aufkleber (50×50 mm)", w: 50, h: 50 },
  a6: { label: "A6 (105×148 mm)", w: 105, h: 148 },
  a5: { label: "A5 (148×210 mm)", w: 148, h: 210 },
  a4: { label: "A4 (210×297 mm)", w: 210, h: 297 },
  a3: { label: "A3-Plakat (297×420 mm)", w: 297, h: 420 },
};

export async function downloadPdf(
  data: string,
  design: QRDesign,
  format: PdfFormatKey,
  filename: string,
) {
  const { jsPDF } = await import("jspdf");
  const { w, h } = PDF_FORMATS[format];

  // Hi-Res-Rendering (≈300 DPI für Druck)
  const canvas = await renderQrCanvas(data, design, 1200);
  const dataUrl = canvas.toDataURL("image/png");
  const aspect = canvas.height / canvas.width;

  const doc = new jsPDF({
    orientation: w >= h ? "landscape" : "portrait",
    unit: "mm",
    format: [w, h],
  });

  const qrW = Math.min(w, h) * 0.66;
  const qrH = qrW * aspect;
  const x = (w - qrW) / 2;
  const y = (h - qrH) / 2;

  doc.addImage(dataUrl, "PNG", x, y, qrW, qrH);
  doc.save(`${filename}.pdf`);
}
