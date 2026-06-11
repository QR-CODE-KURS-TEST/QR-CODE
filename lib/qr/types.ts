// Design-Modell eines QR-Codes. Wird als jsonb in qr_codes.design gespeichert.

export type DotStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareStyle = "square" | "dot" | "extra-rounded";
export type CornerDotStyle = "square" | "dot";
export type GradientType = "linear" | "radial";

export interface QRDesign {
  fgColor: string;
  bgColor: string;
  gradient: {
    enabled: boolean;
    color2: string;
    type: GradientType;
    rotation: number; // Grad
  };
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  cornerColor: string;
  logoDataUrl: string | null;
  logoSizeRatio: number; // 0.1 – 0.5
  frame: {
    enabled: boolean;
    text: string;
    color: string;
  };
}

export const DEFAULT_DESIGN: QRDesign = {
  fgColor: "#4f46e5",
  bgColor: "#ffffff",
  gradient: { enabled: false, color2: "#9333ea", type: "linear", rotation: 45 },
  dotStyle: "rounded",
  cornerSquareStyle: "extra-rounded",
  cornerDotStyle: "dot",
  cornerColor: "#4f46e5",
  logoDataUrl: null,
  logoSizeRatio: 0.3,
  frame: { enabled: false, text: "JETZT SCANNEN", color: "#4f46e5" },
};

export const DOT_STYLE_LABELS: Record<DotStyle, string> = {
  square: "Eckig",
  rounded: "Abgerundet",
  dots: "Punkte",
  classy: "Elegant",
  "classy-rounded": "Elegant rund",
  "extra-rounded": "Extra rund",
};

export const CORNER_SQUARE_LABELS: Record<CornerSquareStyle, string> = {
  square: "Eckig",
  dot: "Rund",
  "extra-rounded": "Abgerundet",
};

export const CORNER_DOT_LABELS: Record<CornerDotStyle, string> = {
  square: "Eckig",
  dot: "Rund",
};

/** Schnell-Vorlagen für den Editor. */
export const QR_PRESETS: { name: string; design: Partial<QRDesign> }[] = [
  {
    name: "Klassisch",
    design: {
      fgColor: "#000000",
      bgColor: "#ffffff",
      cornerColor: "#000000",
      dotStyle: "square",
      cornerSquareStyle: "square",
      cornerDotStyle: "square",
      gradient: { enabled: false, color2: "#000000", type: "linear", rotation: 0 },
    },
  },
  {
    name: "Indigo",
    design: {
      fgColor: "#4f46e5",
      bgColor: "#ffffff",
      cornerColor: "#4f46e5",
      dotStyle: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      gradient: { enabled: false, color2: "#9333ea", type: "linear", rotation: 45 },
    },
  },
  {
    name: "Verlauf",
    design: {
      fgColor: "#6366f1",
      bgColor: "#ffffff",
      cornerColor: "#9333ea",
      dotStyle: "classy-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      gradient: { enabled: true, color2: "#ec4899", type: "linear", rotation: 45 },
    },
  },
  {
    name: "Nacht",
    design: {
      fgColor: "#ffffff",
      bgColor: "#0f172a",
      cornerColor: "#38bdf8",
      dotStyle: "dots",
      cornerSquareStyle: "dot",
      cornerDotStyle: "dot",
      gradient: { enabled: false, color2: "#38bdf8", type: "linear", rotation: 0 },
    },
  },
];
