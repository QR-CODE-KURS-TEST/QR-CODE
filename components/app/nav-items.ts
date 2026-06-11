import {
  LayoutDashboard,
  QrCode,
  Link2,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Für die Mobile-Bottom-Nav (max. 5 prominente Einträge). */
  primary?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, primary: true },
  { href: "/app/qr", label: "QR-Codes", icon: QrCode, primary: true },
  { href: "/app/links", label: "Links", icon: Link2, primary: true },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3, primary: true },
  { href: "/app/settings", label: "Einstellungen", icon: Settings, primary: true },
];
