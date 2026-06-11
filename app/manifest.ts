import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} — QR-Codes, die verkaufen`,
    short_name: APP_NAME,
    description:
      "Designe QR-Codes, kürze Links und tracke jeden Scan in Echtzeit.",
    start_url: "/app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
