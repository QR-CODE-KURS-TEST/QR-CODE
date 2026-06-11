import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Produkt",
    links: [
      { href: "#features", label: "Features" },
      { href: "#preise", label: "Preise" },
      { href: "#use-cases", label: "Anwendungen" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Konto",
    links: [
      { href: "/signup", label: "Registrieren" },
      { href: "/login", label: "Anmelden" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/legal/impressum", label: "Impressum" },
      { href: "/legal/datenschutz", label: "Datenschutz" },
      { href: "/legal/agb", label: "AGB" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">{APP_TAGLINE}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Designe QR-Codes, kürze Links und tracke jeden Scan – in Echtzeit,
              DSGVO-konform.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 grid gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} {APP_NAME}. Alle Rechte vorbehalten.
          </span>
          <span>Made in Germany · DSGVO-konform</span>
        </div>
      </div>
    </footer>
  );
}
