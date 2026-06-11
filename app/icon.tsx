import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4f46e5",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 32 32" width="26" height="26" fill="#ffffff">
          <path d="M7 7h7v7H7V7Zm2 2v3h3V9H9Z" />
          <path d="M18 7h7v7h-7V7Zm2 2v3h3V9h-3Z" />
          <path d="M7 18h7v7H7v-7Zm2 2v3h3v-3H9Z" />
          <rect x="18" y="18" width="3" height="3" rx="0.5" />
          <rect x="22.5" y="18" width="3" height="3" rx="0.5" />
          <rect x="18" y="22.5" width="3" height="3" rx="0.5" />
          <rect x="22.5" y="22.5" width="3" height="3" rx="0.5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
