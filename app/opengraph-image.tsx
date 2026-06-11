import { ImageResponse } from "next/og";

export const alt = "Scanvio — QR-Codes, die verkaufen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#16132b",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.45), transparent 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#4f46e5",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 32 32" width="40" height="40" fill="#ffffff">
              <path d="M7 7h7v7H7V7Zm2 2v3h3V9H9Z" />
              <path d="M18 7h7v7h-7V7Zm2 2v3h3V9h-3Z" />
              <path d="M7 18h7v7H7v-7Zm2 2v3h3v-3H9Z" />
              <rect x="18" y="18" width="3" height="3" />
              <rect x="22.5" y="18" width="3" height="3" />
              <rect x="18" y="22.5" width="3" height="3" />
              <rect x="22.5" y="22.5" width="3" height="3" />
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 600 }}>Scanvio</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>QR-Codes, die</span>
            <span style={{ color: "#a5b4fc" }}>verkaufen.</span>
          </div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.7)", maxWidth: 760 }}>
            Designen · Kürzen · Tracken — in Echtzeit, DSGVO-konform.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          <span>Designbare QR-Codes</span>
          <span>•</span>
          <span>Getrackte Short-Links</span>
          <span>•</span>
          <span>Echtzeit-Analytics</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
